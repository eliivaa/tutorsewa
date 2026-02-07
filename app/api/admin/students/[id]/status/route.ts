import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    console.log("PATCH student status body:", body);
    console.log("Student ID:", params.id);

    const { isSuspended } = body;

    const result = await prisma.user.update({
      where: { id: params.id },
      data: {
        status: isSuspended ? "SUSPENDED" : "ACTIVE",
      },
    });

    console.log("Updated user:", result.id, result.status);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE STUDENT STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
