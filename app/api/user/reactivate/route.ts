import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: "ACTIVE",
        suspendedBy: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account reactivated",
    });

  } catch (err) {
    console.error("REACTIVATE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to reactivate account" },
      { status: 500 }
    );
  }
}