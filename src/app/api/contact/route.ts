import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  if (!body.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Placeholder endpoint: replace this with an email provider/webhook when available.
  console.log("[contact-message]", {
    name: body.name,
    email: body.email,
    subject: body.subject,
  });

  return NextResponse.json({ ok: true });
}
