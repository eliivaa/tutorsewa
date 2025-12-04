// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { uploadToCloudinary } from "@/lib/cloudinary";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const name = formData.get("name") as string;
//     const email = formData.get("email") as string;
//     const phone = formData.get("phone") as string;
//     const password = formData.get("password") as string;
//     const bio = formData.get("bio") as string;
//     const level = formData.get("level") as string;
//     const experience = formData.get("experience") as string;

//     const subjects = formData.getAll("subjects") as string[];

//     const photo = formData.get("photo") as File | null;
//     const cv = formData.get("cv") as File | null;
//     const id = formData.get("id") as File | null;

//     const existing = await prisma.tutor.findUnique({
//       where: { email },
//     });

//     if (existing)
//       return NextResponse.json({ error: "Tutor already exists" }, { status: 400 });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let photoUrl = null;
//     let cvUrl = null;
//     let idUrl = null;

//    if (photo) photoUrl = (await uploadToCloudinary(photo)) as string;
// if (cv) cvUrl = (await uploadToCloudinary(cv)) as string;
// if (id) idUrl = (await uploadToCloudinary(id)) as string;


//     await prisma.tutor.create({
//       data: {
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//         subjects,
//         level,
//         experience,
//         bio,
//         photo: photoUrl,
//         cvUrl: cvUrl,
//         idUrl: idUrl,
//         status: "PENDING",
//       },
//     });

//     return NextResponse.json(
//       { success: true, message: "Tutor registration submitted for admin approval" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("REGISTER ERROR:", error);
//     return NextResponse.json({ error: "Server Error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const password = formData.get("password")?.toString();
    const bio = formData.get("bio")?.toString();
    const level = formData.get("level")?.toString();
    const experience = formData.get("experience")?.toString();
    const subjects = formData.getAll("subjects") as string[];

    const photo = formData.get("photo") as File | null;
    const cv = formData.get("cv") as File | null;
    const id = formData.get("id") as File | null;

    // -------------------------- VALIDATION ----------------------------

    if (!name || !email || !phone || !password || !bio)
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );

    // Password strength validation
    if (password.length < 6)
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );

    // Phone number validation
    if (phone.length < 7)
      return NextResponse.json(
        { error: "Phone number is too short." },
        { status: 400 }
      );

    // Duplicate email check
    const existingEmail = await prisma.tutor.findUnique({
      where: { email },
    });

    if (existingEmail)
      return NextResponse.json(
        { error: "Email already exists. Try logging in instead." },
        { status: 400 }
      );

    // Duplicate phone check
    const existingPhone = await prisma.tutor.findFirst({
      where: { phone },
    });

    if (existingPhone)
      return NextResponse.json(
        { error: "Phone number already registered." },
        { status: 400 }
      );

    // ---------------------- FILE UPLOAD ------------------------

    let photoUrl: string | null = null;
    let cvUrl: string | null = null;
    let idUrl: string | null = null;

    try {
      if (photo) photoUrl = await uploadToCloudinary(photo) as string;
      if (cv) cvUrl = await uploadToCloudinary(cv) as string;;
      if (id) idUrl = await uploadToCloudinary(id) as string;; 
    } catch (uploadError) {
      return NextResponse.json(
        { error: "File upload failed. Try again." },
        { status: 500 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------------- INSERT INTO DATABASE ------------------------

    try {
      await prisma.tutor.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          subjects,
          level,
          experience,
          bio,
          photo: photoUrl,
          cvUrl: cvUrl,
          idUrl: idUrl,
          status: "PENDING",
        },
      });
    } catch (dbError: any) {
      if (dbError.code === "P2002") {
        return NextResponse.json(
          { error: "Email already exists." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Registration successful! Await admin approval." },
      { status: 200 }
    );

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
