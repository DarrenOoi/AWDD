import { NextResponse } from "next/server";
import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? `${siteConfig.shortName} Contact <onboarding@resend.dev>`;

  if (!resendKey || !toEmail) {
    if (process.env.NODE_ENV === "development") {
      console.log("[contact-message]", { name, email, subject, message });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "Contact form is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const resend = new Resend(resendKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `[${siteConfig.shortName} Contact] ${subject}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("[contact-message] send failed", error);
    return NextResponse.json({ error: "Could not send message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
