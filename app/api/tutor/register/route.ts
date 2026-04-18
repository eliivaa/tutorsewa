import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { adminLog } from "@/lib/adminLog";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_SUBJECTS = 5;

export async function POST(req: Request) {
  try {

    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
   const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim();
    const password = formData.get("password")?.toString();
    const bio = formData.get("bio")?.toString();
    const experience = formData.get("experience")?.toString();
    const subjects = formData.getAll("subjects") as string[];
    const rateRaw = formData.get("rate")?.toString().trim();
    const rate = Number(rateRaw);

    const photo = formData.get("photo") as File | null;
    const certificate = formData.get("certificate") as File | null;
    const citizenship = formData.get("citizenship") as File | null;

    const googleUser = !password; // ⭐ detect Google registration

    /* REQUIRED */
    if (!name || !email || !phone || !bio || !experience) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    /* NAME */
    if (!/^[A-Za-z ]{3,}$/.test(name)) {
      return NextResponse.json(
        { error: "Name must contain only letters." },
        { status: 400 }
      );
    }

    /* EMAIL */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    /* PASSWORD (only if manual signup) */
   if (!googleUser && password) {
  if (
    password.length < 8 ||
    !/[A-Za-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters and include a letter, number, and symbol.",
      },
      { status: 400 }
    );
  }
}

    /* SUBJECTS */
    if (subjects.length === 0) {
      return NextResponse.json(
        { error: "At least one subject is required." },
        { status: 400 }
      );
    }

    if (subjects.length > MAX_SUBJECTS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_SUBJECTS} subjects allowed.` },
        { status: 400 }
      );
    }

    /* RATE */
    if (!rateRaw || isNaN(rate) || rate <= 0) {
      return NextResponse.json(
        { error: "Please provide a valid hourly rate." },
        { status: 400 }
      );
    }

   const existingTutor = await prisma.tutor.findFirst({
  where: {
    OR: [
      { email },
      { phone }
    ]
  },
});

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (existingTutor) {
      if (existingTutor.emailVerified) {
        return NextResponse.json(
          { error: "Email already registered." },
          { status: 400 }
        );
      }
       if (existingTutor.phone === phone) {
    return NextResponse.json(
      { error: "Phone number already registered." },
      { status: 400 }
    );
  }

      if (!googleUser) {
        await prisma.tutor.update({
          where: { email },
          data: { verificationCode, codeExpiresAt },
        });

        await sendEmail(email, name, verificationCode);
      }

      return NextResponse.json({
        message: "Verification code resent to your email.",
        email,
      });
    }


    if (!certificate || !citizenship) {
  return NextResponse.json(
    { error: "Certificate and citizenship are required." },
    { status: 400 }
  );
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

for (const file of [certificate, citizenship]) {
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Each file must be under 10MB." },
      { status: 400 }
    );
  }
}

    /* FILE UPLOAD */
    let photoUrl: string | null = null;
    let certificateUrl: string | null = null;
    let citizenshipUrl: string | null = null;

    try {
      if (photo) photoUrl = (await uploadToCloudinary(photo)) as string;
      certificateUrl = (await uploadToCloudinary(certificate!)) as string;
      citizenshipUrl = (await uploadToCloudinary(citizenship!)) as string;
    } catch {
      return NextResponse.json(
        { error: "File upload failed." },
        { status: 500 }
      );
    }

   const hashedPassword = password
  ? await bcrypt.hash(password, 10)
  : "";

  await prisma.tutor.create({
  data: {
    name,
    email,
    phone,
    password: hashedPassword,
    bio,
    experience,

    subjects: {
      create: subjects.map((s) => {
        const [subject, level] = s.split("|");

        return {
          subject: subject.trim(),
          level: level?.trim() || null,
        };
      }),
    },

    rate,
    photo: photoUrl,
    cvUrl: certificateUrl,
    idUrl: citizenshipUrl,
    status: "PENDING",
    emailVerified: googleUser ? true : false,
    verificationCode: googleUser ? null : verificationCode,
    codeExpiresAt: googleUser ? null : codeExpiresAt,
  },
});
    await adminLog(
      "REGISTER",
      "New Tutor Application",
      `${name} applied as tutor for ${subjects.join(", ")}`,
      "SYSTEM_ANNOUNCEMENT",
      "/admin/tutors"
    );

    if (!googleUser) {
      await sendEmail(email, name, verificationCode);
    }

    return NextResponse.json({
      message: googleUser
        ? "Tutor registered successfully."
        : "Verification code sent to your email.",
      email,
    });

  } catch (error) {
    console.error("TUTOR REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

async function sendEmail(email: string, name: string, code: string) {

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
    subject: "TutorSewa Tutor Email Verification",
    html: `
    <div style="font-family:Arial;line-height:1.5;color:#333;">
      <h2 style="color:#006A6A;">TutorSewa Email Verification</h2>
      <p>Hello ${name || "there"},</p>
      <p>Your verification code is:</p>

      <h1 style="letter-spacing:6px;color:#006A6A;">
        ${code}
      </h1>

      <p>This code will expire in <b>10 minutes</b>.</p>
    </div>
    `,
  });
}