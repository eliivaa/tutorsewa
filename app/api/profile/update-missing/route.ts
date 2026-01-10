import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone, grade } = await req.json();

  await prisma.user.update({
    where: { email: token.email },
    data: { phone, grade },
  });

  return NextResponse.json({
    success: true,
    phone,
    grade,
  });
}
