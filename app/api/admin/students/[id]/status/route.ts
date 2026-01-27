import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isSuspended } = await req.json();

    await prisma.user.update({
      where: { id: params.id },
      data: { isSuspended },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE STUDENT STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
