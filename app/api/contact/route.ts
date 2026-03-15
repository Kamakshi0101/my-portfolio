import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECEIVER_EMAIL = "kamakshiagg2005@gmail.com";

function sanitize(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = sanitize(String(body?.name || ""));
    const email = sanitize(String(body?.email || ""));
    const message = sanitize(String(body?.message || ""));

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const smtpUser = (process.env.SMTP_USER || "").trim();
    const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "").trim();

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          ok: false,
          error: "Email service is not configured. Set SMTP_USER and SMTP_PASS in environment variables.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `Portfolio Contact <${smtpUser}>`,
      to: RECEIVER_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
          <h2>New Portfolio Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;white-space:pre-wrap;">${message}</div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as { code?: string; message?: string };

    if (err?.code === "EAUTH") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "SMTP authentication failed. For Gmail, use your Gmail address as SMTP_USER and a Google App Password as SMTP_PASS.",
        },
        { status: 500 }
      );
    }

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        ok: false,
        error: isDev ? `Failed to send message: ${err?.message || "Unknown SMTP error"}` : "Failed to send message. Please try again.",
      },
      { status: 500 }
    );
  }
}
