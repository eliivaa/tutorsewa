// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { uploadToCloudinary } from "@/lib/cloudinary";

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

//     const photo = formData.get("photo") as File | null;
//     const cv = formData.get("cv") as File | null;
//     const id = formData.get("id") as File | null;

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
//     if (phone.length < 7) {
//       return NextResponse.json(
//         { error: "Invalid phone number." },
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

//     // Ensure each subject has level
//     for (const s of subjects) {
//       if (!s.includes("|")) {
//         return NextResponse.json(
//           { error: "Each subject must include a level." },
//           { status: 400 }
//         );
//       }
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

//     /* ================= FILE UPLOAD ================= */
//     let photoUrl: string | null = null;
//     let cvUrl: string | null = null;
//     let idUrl: string | null = null;

//     try {
//       if (photo) photoUrl = (await uploadToCloudinary(photo)) as string;
//       if (cv) cvUrl = (await uploadToCloudinary(cv)) as string;
//       if (id) idUrl = (await uploadToCloudinary(id)) as string;
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
//         subjects, // contains subject|level
//         photo: photoUrl,
//         cvUrl,
//         idUrl,
//         status: "PENDING",
//       },
//     });

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


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

    const photo = formData.get("photo") as File | null;
    const cv = formData.get("cv") as File | null;
    const id = formData.get("id") as File | null;

    /* ================= REQUIRED CHECK ================= */
    if (!name || !email || !phone || !password || !bio || !experience) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    /* ================= EXPERIENCE (STRING) ================= */
    if (!experience || experience.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide teaching experience." },
        { status: 400 }
      );
    }

    /* ================= NAME ================= */
    if (!/^[A-Za-z ]{3,}$/.test(name)) {
      return NextResponse.json(
        { error: "Name must contain only letters and spaces (min 3 chars)." },
        { status: 400 }
      );
    }

    /* ================= EMAIL ================= */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    /* ================= PASSWORD ================= */
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

    /* ================= PHONE ================= */
    if (phone.length < 7) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }

    /* ================= SUBJECTS ================= */
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

    // Ensure subject|level format
    for (const s of subjects) {
      if (!s.includes("|")) {
        return NextResponse.json(
          { error: "Each subject must include a level." },
          { status: 400 }
        );
      }
    }

    /* ================= DUPLICATES ================= */
    if (await prisma.tutor.findUnique({ where: { email } })) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    if (await prisma.tutor.findFirst({ where: { phone } })) {
      return NextResponse.json(
        { error: "Phone number already registered." },
        { status: 400 }
      );
    }

    /* ================= FILE UPLOAD ================= */
    let photoUrl: string | null = null;
    let cvUrl: string | null = null;
    let idUrl: string | null = null;

    try {
      if (photo) photoUrl = (await uploadToCloudinary(photo)) as string;
      if (cv) cvUrl = (await uploadToCloudinary(cv)) as string;
      if (id) idUrl = (await uploadToCloudinary(id)) as string;
    } catch {
      return NextResponse.json(
        { error: "File upload failed." },
        { status: 500 }
      );
    }

    /* ================= SAVE ================= */
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.tutor.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        bio,
        experience,
        subjects, // subject|level
        photo: photoUrl,
        cvUrl,
        idUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful! Await admin approval.",
    });
  } catch (error) {
    console.error("TUTOR REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
