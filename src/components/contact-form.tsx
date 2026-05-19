"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Could not send message right now. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-stone-700">Name</span>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 outline-none transition focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-stone-700">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 outline-none transition focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
          />
        </label>
      </div>
      <label className="space-y-1.5 text-sm">
        <span className="font-medium text-stone-700">Subject</span>
        <input
          name="subject"
          required
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 outline-none transition focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
        />
      </label>
      <label className="space-y-1.5 text-sm">
        <span className="font-medium text-stone-700">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 outline-none transition focus:border-accent/40 focus:bg-white focus:ring-2 focus:ring-accent/15"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "sent" ? (
        <p className="text-sm font-medium text-emerald-700">Thanks - we received your message.</p>
      ) : null}
      {status === "error" ? <p className="text-sm font-medium text-red-700">{errorMessage}</p> : null}
    </form>
  );
}
