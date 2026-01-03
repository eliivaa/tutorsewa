// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import cloudinary from "@/lib/cloudinary";
// import { Readable } from "stream";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     if (!file)
//       return NextResponse.json({ error: "No file" }, { status: 400 });

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const result: any = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "tutorsewa-profiles", resource_type: "image" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       Readable.from(buffer).pipe(stream);
//     });

//     await prisma.user.update({
//       where: { id: session.user.id },
//       data: { image: result.secure_url },
//     });

//     return NextResponse.json({ success: true });

//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // ✅ File type check
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // ✅ Size limit (1MB)
    if (file.size > 1_000_000) {
      return NextResponse.json(
        { error: "Image must be less than 1MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tutorsewa/students",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    // ✅ Update student (User table)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: result.secure_url },
    });

    return NextResponse.json({
      success: true,
      image: result.secure_url,
    });

  } catch (error) {
    console.error("STUDENT UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
