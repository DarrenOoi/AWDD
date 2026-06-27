"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";

import { editorialEase, revealTransition } from "@/components/motion/motion-config";

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
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to send");
      }

      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not send message right now. Please try again.",
      );
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={revealTransition}
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4"
          >
            <motion.span
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
            >
              ✓
            </motion.span>
            <div>
              <p className="font-semibold text-emerald-900">Message sent</p>
              <p className="mt-1 text-sm text-emerald-800">Thanks — we received your message and will review it soon.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: 8 }}
            animate={status === "error" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={status === "error" ? { duration: 0.45 } : revealTransition}
          >
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
            <motion.button
              type="submit"
              disabled={status === "sending"}
              whileHover={status !== "sending" ? { scale: 1.01 } : undefined}
              whileTap={status !== "sending" ? { scale: 0.99 } : undefined}
              transition={{ ease: editorialEase }}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Sending…
                </>
              ) : (
                "Send message"
              )}
            </motion.button>
            {status === "error" ? (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-red-700"
              >
                {errorMessage}
              </motion.p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
