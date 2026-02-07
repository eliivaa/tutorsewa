import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    /* =========================
       AUTH: TUTOR TOKEN
    ========================= */
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find(c => c.startsWith("tutor_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    /* =========================
       READ FILE
    ========================= */
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size > 1_000_000) {
      return NextResponse.json(
        { error: "Image must be under 1MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    /* =========================
       UPLOAD TO CLOUDINARY
    ========================= */
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tutorsewa/tutors",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(stream);
    });

    /* =========================
       UPDATE DATABASE
    ========================= */
    const updatedTutor = await prisma.tutor.update({
      where: { id: decoded.id },
      data: { photo: uploadResult.secure_url },
    });

    return NextResponse.json({
      success: true,
      photo: updatedTutor.photo,
    });

  } catch (error) {
    console.error("TUTOR PHOTO UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
