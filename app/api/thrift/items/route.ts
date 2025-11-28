import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.thriftItem.findMany({
      include: {
        seller: {
          select: {
            name: true,
            grade: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

   return NextResponse.json({ items });


  } catch (err) {
    console.error("FETCH THRIFT ITEMS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load thrift items" },
      { status: 500 }
    );
  }
}
