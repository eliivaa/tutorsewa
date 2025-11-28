import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, subject, condition, price, contact, image } = await req.json();

  await prisma.thriftItem.create({
    data: {
      title,
      subject,
      condition,
      price: Number(price),
      contact,
      image,
      sellerId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
