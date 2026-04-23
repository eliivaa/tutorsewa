import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tutorId, reason, details } = await req.json();

    if (!tutorId || !reason) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 🔒 prevent duplicate spam report
    const existing = await prisma.tutorReport.findFirst({
      where: {
        tutorId,
        reporterId: session.user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already reported this tutor" },
        { status: 400 }
      );
    }

    const report = await prisma.tutorReport.create({
      data: {
        tutorId,
        reporterId: session.user.id,
        reason,
        details,
      },
    });

    // 🔔 notify admin
    await prisma.notification.create({
      data: {
        isForAdmin: true,
        title: "Tutor Report Submitted",
        message: `A tutor has been reported.`,
        type: "SYSTEM_ANNOUNCEMENT",
        actionUrl: "/admin/reports/tutors",
        actionLabel: "Review",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted",
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);

    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}