import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const reports = await prisma.tutorReport.findMany({
    include: {
      tutor: true,
      reporter: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reports });
}