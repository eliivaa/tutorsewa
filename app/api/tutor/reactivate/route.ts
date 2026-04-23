import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const token = cookies().get("tutor_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await prisma.tutor.update({
      where: { id: decoded.id },
      data: { status: "APPROVED" },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("REACTIVATE ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}