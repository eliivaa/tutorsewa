import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  const { email } = await req.json();

  const tutor = await prisma.tutor.findUnique({
    where: { email }
  });

  if (!tutor) {
    return NextResponse.json(
      { error: "Tutor not found" },
      { status: 404 }
    );
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.tutor.update({
    where: { email },
    data: {
      verificationCode: code,
      codeExpiresAt: expiry
    }
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "TutorSewa Tutor Verification Code",
    html: `<h2>Your verification code is ${code}</h2>`
  });

  return NextResponse.json({ success: true });

}