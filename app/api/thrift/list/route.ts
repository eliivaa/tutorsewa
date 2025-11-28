import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.thriftItem.findMany({
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}
