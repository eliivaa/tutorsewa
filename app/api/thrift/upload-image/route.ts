import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
// ================= FILE VALIDATION =================

// Allow only images
if (!file.type.startsWith("image/")) {
  return NextResponse.json(
    { error: "Only image files are allowed" },
    { status: 400 }
  );
}

// Max size: 1MB (good for FYP)
const MAX_FILE_SIZE = 1 * 1024 * 1024;

if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { error: "Image must be less than 1MB" },
    { status: 400 }
  );
}

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tutorsewa-thrift",
          resource_type: "image",
          //  moderation: "aws_rek", 
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(stream);
    });

    const uploadResult = result as any;

if (uploadResult.moderation?.[0]?.status === "rejected") {
  return NextResponse.json(
    { error: "Inappropriate image detected" },
    { status: 400 }
  );
}

    const url = (result as any).secure_url as string;

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("THRIFT UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
