import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { adminLog } from "@/lib/adminLog";

async function sendVerificationEmail(email: string, name: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "TutorSewa Email Verification Code",
    html: `
      <div style="font-family: Arial;">
        <h2>TutorSewa Verification</h2>
        <p>Hello ${name || "there"},</p>
        <p>Your code is:</p>
        <h1>${code}</h1>
        <p>This expires in 10 minutes.</p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword, phone, grade } =
      await req.json();

   // ================= VALIDATION =================

// Normalize email (IMPORTANT)
const normalizedEmail = email?.trim().toLowerCase();

// Required fields
if (!name || !normalizedEmail || !password || !confirmPassword || !phone || !grade) {
  return NextResponse.json(
    { error: "All fields are required" },
    { status: 400 }
  );
}

// Name validation
if (name.trim().length < 3) {
  return NextResponse.json(
    { error: "Name must be at least 3 characters" },
    { status: 400 }
  );
}

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

   const existingUser = await prisma.user.findUnique({
 where: { email: normalizedEmail },
});

if (existingUser) {

  // already verified → block
  if (existingUser.emailVerified) {
    return NextResponse.json(
      { error: "Email already registered. Please login." },
      { status: 400 }
    );
  }

  // not verified → resend OTP
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verifyExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
   where: { email: normalizedEmail },
    data: {
      verifyCode,
      verifyExpiry
    }
  });

 await sendVerificationEmail(normalizedEmail, name, verifyCode);

  return NextResponse.json({
    message: "Verification code resent to your email."
  });
}


// Nepal phone validation
const nepalPhoneRegex =
/^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

if (!nepalPhoneRegex.test(phone)) {
  return NextResponse.json(
    { error: "Enter a valid Nepal mobile number (NTC / Ncell / Smart Telecom)" },
    { status: 400 }
  );
}
    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        grade,
        verifyCode,
        verifyExpiry,
        emailVerified: null,
        authProvider: "CREDENTIALS",
      },
    });

    // Admin notification
    await adminLog(
      "REGISTER",
      "New Student Registered",
      `${name} (${normalizedEmail}) created an account`,
      "SYSTEM_ANNOUNCEMENT",
      "/admin/users"
    );


   await sendVerificationEmail(normalizedEmail, name, verifyCode);

    return NextResponse.json({
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("Error in registration:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

