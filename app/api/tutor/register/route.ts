// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { uploadToCloudinary } from "@/lib/cloudinary";
// import { adminLog } from "@/lib/adminLog";

// export const runtime = "nodejs";

// const MAX_SUBJECTS = 5;

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const name = formData.get("name")?.toString().trim();
//     const email = formData.get("email")?.toString().trim();
//     const phone = formData.get("phone")?.toString().trim();
//     const password = formData.get("password")?.toString();
//     const bio = formData.get("bio")?.toString();
//     const experience = formData.get("experience")?.toString();
//     const subjects = formData.getAll("subjects") as string[];
//     const rateRaw = formData.get("rate")?.toString().trim();
//     const rate = Number(rateRaw);


//   const photo = formData.get("photo") as File | null;
// const certificate = formData.get("certificate") as File | null;
// const citizenship = formData.get("citizenship") as File | null;

//     /* ================= REQUIRED CHECK ================= */
//     if (!name || !email || !phone || !password || !bio || !experience) {
//       return NextResponse.json(
//         { error: "All required fields must be filled." },
//         { status: 400 }
//       );
//     }

//     /* ================= EXPERIENCE (STRING) ================= */
//     if (!experience || experience.trim().length < 2) {
//       return NextResponse.json(
//         { error: "Please provide teaching experience." },
//         { status: 400 }
//       );
//     }

//     /* ================= NAME ================= */
//     if (!/^[A-Za-z ]{3,}$/.test(name)) {
//       return NextResponse.json(
//         { error: "Name must contain only letters and spaces (min 3 chars)." },
//         { status: 400 }
//       );
//     }

//     /* ================= EMAIL ================= */
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         { error: "Invalid email format." },
//         { status: 400 }
//       );
//     }

//     /* ================= PASSWORD ================= */
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

//     if (!passwordRegex.test(password)) {
//       return NextResponse.json(
//         {
//           error:
//             "Password must include uppercase, lowercase, number and special character.",
//         },
//         { status: 400 }
//       );
//     }

//     /* ================= PHONE ================= */
// const nepalPhoneRegex =
//   /^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

// if (!nepalPhoneRegex.test(phone)) {
//   return NextResponse.json(
//     {
//       error:
//         "Enter a valid Nepal mobile number (NTC / Ncell / Smart Telecom).",
//     },
//     { status: 400 }
//   );
// }

//     /* ================= SUBJECTS ================= */
//     if (subjects.length === 0) {
//       return NextResponse.json(
//         { error: "At least one subject is required." },
//         { status: 400 }
//       );
//     }

//     if (subjects.length > MAX_SUBJECTS) {
//       return NextResponse.json(
//         { error: `Maximum ${MAX_SUBJECTS} subjects allowed.` },
//         { status: 400 }
//       );
//     }

//     // Ensure subject|level format
//     for (const s of subjects) {
//       if (!s.includes("|")) {
//         return NextResponse.json(
//           { error: "Each subject must include a level." },
//           { status: 400 }
//         );
//       }
//     }
//     //  rate required
//     if (!rateRaw || isNaN(rate) || rate <= 0) {
//   return NextResponse.json(
//     { error: "Please provide a valid hourly rate." },
//     { status: 400 }
//   );
// }


//     /* ================= DUPLICATES ================= */
//     if (await prisma.tutor.findUnique({ where: { email } })) {
//       return NextResponse.json(
//         { error: "Email already registered." },
//         { status: 400 }
//       );
//     }

//     if (await prisma.tutor.findFirst({ where: { phone } })) {
//       return NextResponse.json(
//         { error: "Phone number already registered." },
//         { status: 400 }
//       );
//     }

//     /* ================= FILE VALIDATION ================= */

// if (!certificate) {
//   return NextResponse.json(
//     { error: "Please upload a teaching or academic certificate." },
//     { status: 400 }
//   );
// }

// if (!citizenship) {
//   return NextResponse.json(
//     { error: "Please upload your citizenship card photo." },
//     { status: 400 }
//   );
// }

// if (!certificate.type.startsWith("image/")) {
//   return NextResponse.json(
//     { error: "Certificate must be an image file (JPG, PNG, etc)." },
//     { status: 400 }
//   );
// }

// if (!citizenship.type.startsWith("image/")) {
//   return NextResponse.json(
//     { error: "Citizenship card must be an image file." },
//     { status: 400 }
//   );
// }

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// if (certificate.size > MAX_FILE_SIZE || citizenship.size > MAX_FILE_SIZE) {
//   return NextResponse.json(
//     { error: "File size must be under 5MB." },
//     { status: 400 }
//   );
// }
//     /* ================= FILE UPLOAD ================= */
//     let photoUrl: string | null = null;
//     let cvUrl: string | null = null;
//     let idUrl: string | null = null;

//     try {
//      if (photo) photoUrl = (await uploadToCloudinary(photo)) as string;
// if (certificate) cvUrl = (await uploadToCloudinary(certificate)) as string;
// if (citizenship) idUrl = (await uploadToCloudinary(citizenship)) as string;
//     } catch {
//       return NextResponse.json(
//         { error: "File upload failed." },
//         { status: 500 }
//       );
//     }

//     /* ================= SAVE ================= */
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.tutor.create({
//       data: {
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//         bio,
//         experience,
//         subjects, // subject|level
//         rate,
//         photo: photoUrl,
//         cvUrl,
//         idUrl,
//         status: "PENDING",
//       },
//     });
   
//     await adminLog(
//   "REGISTER",
//   "New Tutor Application",
//   `${name} applied as tutor for ${subjects.join(", ")}`,
//   "SYSTEM_ANNOUNCEMENT",
//   "/admin/tutors"
// );

//     return NextResponse.json({
//       success: true,
//       message: "Registration successful! Await admin approval.",
//     });
//   } catch (error) {
//     console.error("TUTOR REGISTER ERROR:", error);
//     return NextResponse.json(
//       { error: "Unexpected server error." },
//       { status: 500 }
//     );
//   }
// }


// after google

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { uploadToCloudinary } from "@/lib/cloudinary";
// import { adminLog } from "@/lib/adminLog";

// export const runtime = "nodejs";

// const MAX_SUBJECTS = 5;

// export async function POST(req: Request) {
//   try {

//     const formData = await req.formData();

//     const name = formData.get("name")?.toString().trim();
//     const email = formData.get("email")?.toString().trim();
//     const phone = formData.get("phone")?.toString().trim();
//     const password = formData.get("password")?.toString();
//     const bio = formData.get("bio")?.toString();
//     const experience = formData.get("experience")?.toString();

//     const subjects = formData.getAll("subjects") as string[];

//     const rateRaw = formData.get("rate")?.toString().trim();
//     const rate = Number(rateRaw);

//     const photo = formData.get("photo") as File | null;
//     const certificate = formData.get("certificate") as File | null;
//     const citizenship = formData.get("citizenship") as File | null;

//     /* ================= REQUIRED CHECK ================= */

//     if (!name || !email || !phone || !password || !bio || !experience) {
//       return NextResponse.json(
//         { error: "All required fields must be filled." },
//         { status: 400 }
//       );
//     }

//     /* ================= NAME ================= */

//     if (!/^[A-Za-z ]{3,}$/.test(name)) {
//       return NextResponse.json(
//         { error: "Name must contain only letters." },
//         { status: 400 }
//       );
//     }

//     /* ================= EMAIL ================= */

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         { error: "Invalid email format." },
//         { status: 400 }
//       );
//     }

//     /* ================= PASSWORD ================= */

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

//     if (!passwordRegex.test(password)) {
//       return NextResponse.json(
//         {
//           error:
//             "Password must include uppercase, lowercase, number and special character.",
//         },
//         { status: 400 }
//       );
//     }

//     /* ================= PHONE ================= */

//     const nepalPhoneRegex =
//       /^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

//     if (!nepalPhoneRegex.test(phone)) {
//       return NextResponse.json(
//         { error: "Enter a valid Nepal mobile number." },
//         { status: 400 }
//       );
//     }

//     /* ================= SUBJECTS ================= */

//     if (subjects.length === 0) {
//       return NextResponse.json(
//         { error: "At least one subject is required." },
//         { status: 400 }
//       );
//     }

//     if (subjects.length > MAX_SUBJECTS) {
//       return NextResponse.json(
//         { error: `Maximum ${MAX_SUBJECTS} subjects allowed.` },
//         { status: 400 }
//       );
//     }

//     for (const s of subjects) {
//       if (!s.includes("|")) {
//         return NextResponse.json(
//           { error: "Each subject must include a level." },
//           { status: 400 }
//         );
//       }
//     }

//     /* ================= RATE ================= */

//     if (!rateRaw || isNaN(rate) || rate <= 0) {
//       return NextResponse.json(
//         { error: "Please provide a valid hourly rate." },
//         { status: 400 }
//       );
//     }

//     /* ================= DUPLICATES ================= */

//     if (await prisma.tutor.findUnique({ where: { email } })) {
//       return NextResponse.json(
//         { error: "Email already registered." },
//         { status: 400 }
//       );
//     }

//     if (await prisma.tutor.findFirst({ where: { phone } })) {
//       return NextResponse.json(
//         { error: "Phone number already registered." },
//         { status: 400 }
//       );
//     }

//     /* ================= FILE VALIDATION ================= */

//     if (!certificate) {
//       return NextResponse.json(
//         { error: "Please upload a teaching certificate." },
//         { status: 400 }
//       );
//     }

//     if (!citizenship) {
//       return NextResponse.json(
//         { error: "Please upload citizenship card photo." },
//         { status: 400 }
//       );
//     }

//     if (!certificate.type.startsWith("image/")) {
//       return NextResponse.json(
//         { error: "Certificate must be an image." },
//         { status: 400 }
//       );
//     }

//     if (!citizenship.type.startsWith("image/")) {
//       return NextResponse.json(
//         { error: "Citizenship card must be an image." },
//         { status: 400 }
//       );
//     }

//     const MAX_FILE_SIZE = 5 * 1024 * 1024;

//     if (
//       certificate.size > MAX_FILE_SIZE ||
//       citizenship.size > MAX_FILE_SIZE
//     ) {
//       return NextResponse.json(
//         { error: "File size must be under 5MB." },
//         { status: 400 }
//       );
//     }

//     /* ================= FILE UPLOAD ================= */

//     let photoUrl: string | null = null;
//     let certificateUrl: string | null = null;
//     let citizenshipUrl: string | null = null;

//     try {

//       if (photo)
//         photoUrl = (await uploadToCloudinary(photo)) as string;

//       certificateUrl = (await uploadToCloudinary(certificate)) as string;

//       citizenshipUrl = (await uploadToCloudinary(citizenship)) as string;

//     } catch {

//       return NextResponse.json(
//         { error: "File upload failed." },
//         { status: 500 }
//       );
//     }

//     /* ================= SAVE ================= */

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.tutor.create({
//       data: {
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//         bio,
//         experience,
//         subjects,
//         rate,
//         photo: photoUrl,
//         cvUrl: certificateUrl,
//         idUrl: citizenshipUrl,
//         status: "PENDING",
//       },
//     });

//     /* ================= ADMIN LOG ================= */

//     await adminLog(
//       "REGISTER",
//       "New Tutor Application",
//       `${name} applied as tutor for ${subjects.join(", ")}`,
//       "SYSTEM_ANNOUNCEMENT",
//       "/admin/tutors"
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Registration submitted. Await admin approval.",
//     });

//   } catch (error) {

//     console.error("TUTOR REGISTER ERROR:", error);

//     return NextResponse.json(
//       { error: "Unexpected server error." },
//       { status: 500 }
//     );
//   }
// }





// // after otp

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { uploadToCloudinary } from "@/lib/cloudinary";
// import { adminLog } from "@/lib/adminLog";
// import nodemailer from "nodemailer";

// export const runtime = "nodejs";

// const MAX_SUBJECTS = 5;

// export async function POST(req: Request) {
//   try {

//     const formData = await req.formData();

//     const name = formData.get("name")?.toString().trim();
//     const email = formData.get("email")?.toString().trim();
//     const phone = formData.get("phone")?.toString().trim();
//     const password = formData.get("password")?.toString();
//     const bio = formData.get("bio")?.toString();
//     const experience = formData.get("experience")?.toString();

//     const subjects = formData.getAll("subjects") as string[];

//     const rateRaw = formData.get("rate")?.toString().trim();
//     const rate = Number(rateRaw);

//     const photo = formData.get("photo") as File | null;
//     const certificate = formData.get("certificate") as File | null;
//     const citizenship = formData.get("citizenship") as File | null;

//     /* ================= REQUIRED CHECK ================= */

//     if (!name || !email || !phone || !password || !bio || !experience) {
//       return NextResponse.json(
//         { error: "All required fields must be filled." },
//         { status: 400 }
//       );
//     }

//     /* ================= NAME ================= */

//     if (!/^[A-Za-z ]{3,}$/.test(name)) {
//       return NextResponse.json(
//         { error: "Name must contain only letters." },
//         { status: 400 }
//       );
//     }

//     /* ================= EMAIL ================= */

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         { error: "Invalid email format." },
//         { status: 400 }
//       );
//     }

//     /* ================= PASSWORD ================= */

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

//     if (!passwordRegex.test(password)) {
//       return NextResponse.json(
//         {
//           error:
//             "Password must include uppercase, lowercase, number and special character.",
//         },
//         { status: 400 }
//       );
//     }

//     /* ================= PHONE ================= */

//     const nepalPhoneRegex =
//       /^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

//     if (!nepalPhoneRegex.test(phone)) {
//       return NextResponse.json(
//         { error: "Enter a valid Nepal mobile number." },
//         { status: 400 }
//       );
//     }

//     /* ================= SUBJECTS ================= */

//     if (subjects.length === 0) {
//       return NextResponse.json(
//         { error: "At least one subject is required." },
//         { status: 400 }
//       );
//     }

//     if (subjects.length > MAX_SUBJECTS) {
//       return NextResponse.json(
//         { error: `Maximum ${MAX_SUBJECTS} subjects allowed.` },
//         { status: 400 }
//       );
//     }

//     for (const s of subjects) {
//       if (!s.includes("|")) {
//         return NextResponse.json(
//           { error: "Each subject must include a level." },
//           { status: 400 }
//         );
//       }
//     }

//     /* ================= RATE ================= */

//     if (!rateRaw || isNaN(rate) || rate <= 0) {
//       return NextResponse.json(
//         { error: "Please provide a valid hourly rate." },
//         { status: 400 }
//       );
//     }

//     /* ================= CHECK EXISTING TUTOR ================= */

//     const existingTutor = await prisma.tutor.findUnique({
//       where: { email },
//     });

//     const verificationCode =
//       Math.floor(100000 + Math.random() * 900000).toString();

//     const codeExpiresAt =
//       new Date(Date.now() + 10 * 60 * 1000); // 10 min

//     if (existingTutor) {

//       if (existingTutor.emailVerified) {
//         return NextResponse.json(
//           { error: "Email already registered." },
//           { status: 400 }
//         );
//       }

//       await prisma.tutor.update({
//         where: { email },
//         data: {
//           verificationCode,
//           codeExpiresAt,
//         },
//       });

//       await sendEmail(email, name, verificationCode);

//       return NextResponse.json({
//         message: "Verification code resent to your email.",
//       });
//     }

//     /* ================= FILE VALIDATION ================= */

//     if (!certificate) {
//       return NextResponse.json(
//         { error: "Please upload a teaching certificate." },
//         { status: 400 }
//       );
//     }

//     if (!citizenship) {
//       return NextResponse.json(
//         { error: "Please upload citizenship card photo." },
//         { status: 400 }
//       );
//     }

//     if (!certificate.type.startsWith("image/")) {
//       return NextResponse.json(
//         { error: "Certificate must be an image." },
//         { status: 400 }
//       );
//     }

//     if (!citizenship.type.startsWith("image/")) {
//       return NextResponse.json(
//         { error: "Citizenship card must be an image." },
//         { status: 400 }
//       );
//     }

//     const MAX_FILE_SIZE = 5 * 1024 * 1024;

//     if (
//       certificate.size > MAX_FILE_SIZE ||
//       citizenship.size > MAX_FILE_SIZE
//     ) {
//       return NextResponse.json(
//         { error: "File size must be under 5MB." },
//         { status: 400 }
//       );
//     }

//     /* ================= FILE UPLOAD ================= */

//     let photoUrl: string | null = null;
//     let certificateUrl: string | null = null;
//     let citizenshipUrl: string | null = null;

//     try {

//       if (photo)
//         photoUrl = (await uploadToCloudinary(photo)) as string;

//       certificateUrl =
//         (await uploadToCloudinary(certificate)) as string;

//       citizenshipUrl =
//         (await uploadToCloudinary(citizenship)) as string;

//     } catch {

//       return NextResponse.json(
//         { error: "File upload failed." },
//         { status: 500 }
//       );
//     }

//     /* ================= SAVE ================= */

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.tutor.create({
//       data: {
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//         bio,
//         experience,
//         subjects,
//         rate,
//         photo: photoUrl,
//         cvUrl: certificateUrl,
//         idUrl: citizenshipUrl,
//         status: "SUSPENDED", 

//         emailVerified: false,
//         verificationCode,
//         codeExpiresAt,
//       },
//     });

//     /* ================= ADMIN LOG ================= */

//     await adminLog(
//       "REGISTER",
//       "New Tutor Application",
//       `${name} applied as tutor for ${subjects.join(", ")}`,
//       "SYSTEM_ANNOUNCEMENT",
//       "/admin/tutors"
//     );

//     /* ================= SEND OTP EMAIL ================= */

//     await sendEmail(email, name, verificationCode);

//     return NextResponse.json({
//       message: "Verification code sent to your email.",
//       email,
//     });

//   } catch (error) {

//     console.error("TUTOR REGISTER ERROR:", error);

//     return NextResponse.json(
//       { error: "Unexpected server error." },
//       { status: 500 }
//     );
//   }
// }

// /* ================= EMAIL FUNCTION ================= */

// async function sendEmail(email: string, name: string, code: string) {

//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_SERVER,
//     port: Number(process.env.EMAIL_PORT),
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: "TutorSewa Tutor Email Verification",
//     html: `
//       <div style="font-family: Arial; line-height:1.5; color:#333;">
//         <h2 style="color:#006A6A;">TutorSewa Email Verification</h2>

//         <p>Hello ${name || "there"},</p>

//         <p>Your verification code is:</p>

//         <h1 style="letter-spacing:6px;color:#006A6A;">
//           ${code}
//         </h1>

//         <p>This code will expire in <b>10 minutes</b>.</p>

//         <p>If you didn’t create this account, ignore this email.</p>
//       </div>
//     `,
//   });
// }

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
    const email = formData.get("email")?.toString().trim();
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

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return NextResponse.json(
          {
            error:
              "Password must include uppercase, lowercase, number and special character.",
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

    const existingTutor = await prisma.tutor.findUnique({
      where: { email },
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
    subjects,
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