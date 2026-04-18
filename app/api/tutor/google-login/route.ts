import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/tutor/login", process.env.NEXTAUTH_URL!));
  }

  const tutor = await prisma.tutor.findUnique({
    where: { email: session.user.email }
  });

  if (!tutor) {
    return NextResponse.redirect(new URL("/tutor/login?error=notTutor", process.env.NEXTAUTH_URL!));
  }

  if (!tutor.emailVerified) {
    return NextResponse.redirect(new URL("/tutor/login?error=verifyEmail", process.env.NEXTAUTH_URL!));
  }

  const token = jwt.sign(
    {
      id: tutor.id,
      email: tutor.email,
      role: "TUTOR",
      status: tutor.status,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect(
    new URL("/tutor/dashboard", process.env.NEXTAUTH_URL!)
  );

  response.cookies.set("tutor_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}