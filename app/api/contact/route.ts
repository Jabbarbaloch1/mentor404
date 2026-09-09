import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Optional: send email notification via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFY_EMAIL) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Mentor404 <onboarding@resend.dev>",
          to: process.env.CONTACT_NOTIFY_EMAIL,
          subject: `New contact form message: ${subject || "No subject"}`,
          text: `From: ${name} (${email})\n\n${message}`,
        });
      } catch (e) {
        console.error("Email notify failed", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
