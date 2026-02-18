import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { itemId } = await req.json();

  const item = await prisma.thriftItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.sellerId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.thriftItem.update({
    where: { id: itemId },
    data: { isActive: false },   // 👈 soft delete
  });

  return NextResponse.json({ success: true });
}
