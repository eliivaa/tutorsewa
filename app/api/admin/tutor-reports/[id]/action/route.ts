import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    /* ================= ADMIN AUTH ================= */

    const cookies = req.headers.get("cookie") || "";
    const match = cookies.match(/admin_token=([^;]+)/);
    const token = match?.[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    /* ================= INPUT ================= */

    const { action } = await req.json(); // "WARN" | "SUSPEND"

    if (!["WARN", "SUSPEND"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    /* ================= FETCH REPORT ================= */

    const report = await prisma.tutorReport.findUnique({
      where: { id: params.id },
      include: { tutor: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    if (report.status === "RESOLVED") {
      return NextResponse.json(
        { error: "Report already handled" },
        { status: 400 }
      );
    }

    const tutor = report.tutor;

    /* ================= EMAIL SETUP ================= */

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    /* ================= WARN ================= */

    if (action === "WARN") {
      await prisma.notification.create({
        data: {
          tutorId: tutor.id,
          title: "⚠️ Account Warning",
         message: `
Your account has been suspended.

Reason: ${report.reason}
Details: ${report.details || "Not provided"}
Please follow platform rules.`,
          type: "SYSTEM_ANNOUNCEMENT",
          actionUrl: "/tutor/dashboard",
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: tutor.email,
          subject: "⚠️ Account Warning - TutorSewa",
         html: `
  <div style="font-family:Arial;color:#333;line-height:1.6">
    <h2 style="color:#d32f2f">Account Suspended</h2>

    <p>Hello ${tutor.name},</p>

    <p>Your account has been suspended based on the following report:</p>

    <p><b>Reason:</b> ${report.reason}</p>
    <p><b>Details:</b> ${report.details || "Not provided"}</p>

    <p>If you believe this is a mistake, please contact support.</p>
  </div>
`,
        });
      } catch (err) {
        console.error("WARN EMAIL ERROR:", err);
      }
    }

    /* ================= SUSPEND ================= */

    if (action === "SUSPEND") {
      // 🔥 IMPORTANT: also update USER (login block)
      await prisma.user.update({
        where: { email: tutor.email },
        data: {
          status: "SUSPENDED",
          suspendedBy: "ADMIN",
        },
      });

      await prisma.tutor.update({
        where: { id: tutor.id },
        data: {
          status: "SUSPENDED",
          suspensionReason: report.reason,
        },
      });

      await prisma.notification.create({
        data: {
          tutorId: tutor.id,
          title: "🚫 Account Suspended",
          message: `Your account has been suspended due to: ${report.reason}`,
          type: "SYSTEM_ANNOUNCEMENT",
          actionUrl: "/tutor/dashboard",
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: tutor.email,
          subject: "🚫 Account Suspended - TutorSewa",
          html: `
            <div style="font-family:Arial;color:#333">
              <h2 style="color:#d32f2f">Account Suspended</h2>
              <p>Hello ${tutor.name},</p>
              <p>Your account has been suspended due to:</p>
              <p><b>${report.reason}</b></p>
              <p>If you believe this is a mistake, contact support.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("SUSPEND EMAIL ERROR:", err);
      }
    }

    /* ================= MARK REPORT RESOLVED ================= */

    await prisma.tutorReport.update({
      where: { id: report.id },
      data: {
        status: "RESOLVED",
        actionTaken: action, // "WARN" | "SUSPEND"
      },
    });

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      message:
        action === "WARN"
          ? "Tutor warned successfully"
          : "Tutor suspended successfully",
    });

  } catch (err) {
    console.error("ADMIN ACTION ERROR:", err);

    return NextResponse.json(
      { error: "Failed action" },
      { status: 500 }
    );
  }
}