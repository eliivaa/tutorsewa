import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.thriftItem.findMany({
    where: {
      isReported: true,
    },
    include: {
      seller: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}