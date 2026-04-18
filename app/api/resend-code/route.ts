import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "This account is already verified. Please login." },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verifyCode,
        verifyExpiry,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "TutorSewa New Verification Code",
      html: `
        <div style="font-family: Arial; line-height:1.5; color:#333;">
          <h2 style="color:#006A6A;">TutorSewa Email Verification</h2>
          <p>Your new verification code is:</p>
          <h1 style="letter-spacing:6px;color:#006A6A;">
            ${verifyCode}
          </h1>
          <p>This code will expire in <b>10 minutes</b>.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "New verification code sent.",
    });
  } catch (error) {
    console.error("Resend code error:", error);

    return NextResponse.json(
      { error: "Failed to resend code" },
      { status: 500 }
    );
  }
}