// after Email


import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { adminLog } from "@/lib/adminLog";

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword, phone, grade } = await req.json();

    // Validation
    if (!email || !password || !confirmPassword)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    if (password !== confirmPassword)
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    // Hash password and generate verification token
    const hashedPassword = await hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Temporarily create user with verification token
   await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    phone,
    grade,
    verifyToken,
    authProvider: "CREDENTIALS", 
  },
});

await adminLog(
  "REGISTER",
  "New Student Registered",
  `${name} (${email}) created an account`,
  "SYSTEM_ANNOUNCEMENT",
  "/admin/users"
);


    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/api/verify?email=${encodeURIComponent(
      email
    )}&verifyToken=${verifyToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your TutorSewa email",
      html: `
        <div style="font-family: Arial; line-height: 1.5; color: #333;">
          <h2 style="color: #006A6A;">Verify your email</h2>
          <p>Hi ${name || "there"},</p>
          <p>Please verify your TutorSewa account by clicking below:</p>
          <a href="${verifyUrl}" 
             style="background:#006A6A;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
             Verify Email
          </a>
          <p>If you didn’t request this, please ignore it.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Verification email sent! Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


