// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// const VALID_STATUSES = ["APPROVED", "REJECTED", "SUSPENDED"];

// export async function POST(req: Request) {
//   try {
//     // 🔐 ADMIN AUTH (SAFE COOKIE PARSE)
//     const cookies = req.headers.get("cookie") || "";
//     const match = cookies.match(/admin_token=([^;]+)/);
//     const token = match?.[1];

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     jwt.verify(token, process.env.JWT_SECRET!);

//     const { tutorId, status } = await req.json();

//     if (!tutorId || !status) {
//       return NextResponse.json(
//         { error: "Missing tutorId or status" },
//         { status: 400 }
//       );
//     }

//     if (!VALID_STATUSES.includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid status value" },
//         { status: 400 }
//       );
//     }

//     const tutor = await prisma.tutor.findUnique({
//       where: { id: tutorId },
//     });

//     if (!tutor) {
//       return NextResponse.json(
//         { error: "Tutor not found" },
//         { status: 404 }
//       );
//     }

//     const updatedTutor = await prisma.tutor.update({
//       where: { id: tutorId },
//       data: { status },
//     });

//     return NextResponse.json({
//       success: true,
//       message: `Tutor ${status.toLowerCase()} successfully`,
//       tutor: updatedTutor,
//     });

//   } catch (err) {
//     console.error("UPDATE STATUS ERROR:", err);
//     return NextResponse.json(
//       { error: "Failed to update tutor status" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

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

    /* ================= REQUEST DATA ================= */

    const { tutorId, status, reason } = await req.json();

    if (!tutorId || !status) {
      return NextResponse.json(
        { error: "Missing tutorId or status" },
        { status: 400 }
      );
    }

    /* ================= FETCH TUTOR ================= */

    const tutor = await prisma.tutor.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return NextResponse.json(
        { error: "Tutor not found" },
        { status: 404 }
      );
    }

    /* ================= STATUS TRANSITIONS ================= */

    const VALID_TRANSITIONS: Record<string, string[]> = {
      PENDING: ["APPROVED", "REJECTED"],
      APPROVED: ["SUSPENDED"],
      SUSPENDED: ["APPROVED"],
      REJECTED: [],
    };

    if (!VALID_TRANSITIONS[tutor.status]?.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${tutor.status} to ${status}`,
        },
        { status: 400 }
      );
    }

    /* ================= REASON VALIDATION ================= */

    if (
      (status === "REJECTED" || status === "SUSPENDED") &&
      (!reason || reason.trim().length < 5)
    ) {
      return NextResponse.json(
        { error: "A valid reason is required (min 5 characters)" },
        { status: 400 }
      );
    }

    /* ================= UPDATE DATABASE ================= */

    const updatedTutor = await prisma.tutor.update({
      where: { id: tutorId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? reason : null,
        suspensionReason: status === "SUSPENDED" ? reason : null,
      },
    });
  /* ================= CREATE SYSTEM NOTIFICATION ================= */

await prisma.notification.create({
  data: {
    tutorId: tutor.id,
    title: `Tutor account ${status.toLowerCase()}`,
    message:
      status === "APPROVED"
        ? "Your tutor application has been approved."
        : status === "REJECTED"
        ? `Your tutor application was rejected. Reason: ${reason}`
        : `Your tutor account has been suspended. Reason: ${reason}`,
    type: "SYSTEM_ANNOUNCEMENT",
    actionUrl: "/tutor/dashboard",
  },
});
  

    /* ================= EMAIL NOTIFICATION ================= */

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let subject = "";
    let message = "";

    
    
  if (status === "APPROVED") {

  subject = "Tutor Application Approved - TutorSewa";

  message = `
  <div style="font-family:Arial;line-height:1.6;color:#333">

    <h2 style="color:#2e7d32">Congratulations ${tutor.name}!</h2>

    <p>Your tutor application has been <b>approved</b>.</p>

    <p>You can now login and start teaching students on TutorSewa.</p>

    <p style="margin-top:20px">
      <a href="http://localhost:3000/tutor/login"
      style="background:#006A6A;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
      Login to your tutor dashboard
      </a>
    </p>

    <hr/>

    <p>Welcome to the TutorSewa community.</p>

    <p>— TutorSewa Team</p>

  </div>
  `;
}
if (status === "REJECTED") {

  subject = "Tutor Application Rejected - TutorSewa";

  message = `
  <div style="font-family:Arial;line-height:1.6;color:#333">

    <h2 style="color:#d32f2f">Application Update</h2>

    <p>Hello ${tutor.name},</p>

    <p>Unfortunately your tutor application has been <b>rejected</b>.</p>

    <p><b>Reason:</b> ${reason}</p>

    <p>You may review the feedback and apply again if improvements are made.</p>

    <hr/>

    <p>If you believe this decision is incorrect please contact support.</p>

    <p>— TutorSewa Team</p>

  </div>
  `;
}

    if (status === "SUSPENDED") {
  subject = "Tutor Account Suspended - TutorSewa";
  message = `
  <div style="font-family:Arial">
    <h2 style="color:#d32f2f">Account Suspended</h2>

    <p>Hello ${tutor.name},</p>

    <p>Your tutor account has been suspended by the admin.</p>

    <p><b>Reason:</b> ${reason}</p>

    <p>If you believe this is a mistake please contact support.</p>

    <hr/>
    <p>TutorSewa Team</p>
  </div>
  `;
}

    if (subject) {
    try {

  console.log("Sending email to:", tutor.email);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: tutor.email,
    subject,
    html: message,
  });

  console.log("Email sent:", info);

} catch (err) {

  console.error("EMAIL ERROR:", err);

}
    }

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      message: `Tutor ${status.toLowerCase()} successfully`,
      tutor: updatedTutor,
    });

  } catch (err) {

    console.error("UPDATE STATUS ERROR:", err);

    return NextResponse.json(
      { error: "Failed to update tutor status" },
      { status: 500 }
    );

  }

}