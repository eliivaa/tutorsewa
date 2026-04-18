import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const { email, code } = await req.json();

    const tutor = await prisma.tutor.findUnique({
      where: { email }
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    if (tutor.verificationCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!tutor.codeExpiresAt || tutor.codeExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 }
      );
    }

    await prisma.tutor.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        codeExpiresAt: null
      }
    });

    return NextResponse.json({
      success: true
    });

  } catch (err) {

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );

  }

}