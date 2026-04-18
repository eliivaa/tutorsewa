import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const { room, role } = await req.json();

  let userName = "Guest";

  try {
    /* =========================
       TUTOR (JWT COOKIE)
    ========================= */
    if (role === "tutor") {
      const tutorToken = cookies().get("tutor_token")?.value;

      if (tutorToken) {
        const decoded = jwt.verify(
          tutorToken,
          process.env.JWT_SECRET!
        ) as { id: string };

        const tutor = await prisma.tutor.findUnique({
          where: { id: decoded.id },
          select: { name: true },
        });

        if (tutor?.name) {
          userName = tutor.name;
        }
      }
    }

    /* =========================
       STUDENT (NextAuth)
    ========================= */
    else {
      const nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!,
      });

      // ✅ BEST: directly from JWT (fast, no DB call)
      if (nextAuthToken?.name) {
        userName = nextAuthToken.name as string;
      }

      // OPTIONAL (if you want DB fresh data instead)
      /*
      if (nextAuthToken?.id) {
        const user = await prisma.user.findUnique({
          where: { id: nextAuthToken.id as string },
          select: { name: true },
        });

        if (user?.name) {
          userName = user.name;
        }
      }
      */
    }

    /* =========================
       LIVEKIT TOKEN
    ========================= */
    const at = new AccessToken(
      "devkey",
      "mysupersecretkey1234567890123456",
      {
        identity: userName, // ✅ REAL NAME
      }
    );

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    console.log("LIVEKIT TOKEN GENERATED FOR:", userName);

    return NextResponse.json({
      token,
      identity: userName,
    });

  } catch (err) {
    console.error("TOKEN ERROR:", err);

    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}


// due payment


// import { NextRequest, NextResponse } from "next/server";
// import { AccessToken } from "livekit-server-sdk";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { getToken } from "next-auth/jwt";
// import { checkStudentAccess } from "@/lib/paymentGuard";

// export async function POST(req: NextRequest) {
//   try {
//     const { room, role } = await req.json();

//     /* ================= VALIDATION ================= */
//     if (!room) {
//       return NextResponse.json(
//         { error: "Room is required" },
//         { status: 400 }
//       );
//     }

//     let userName = "Guest";

//     /* =========================
//        TUTOR (JWT COOKIE)
//     ========================= */
//     if (role === "tutor") {
//       const tutorToken = cookies().get("tutor_token")?.value;

//       if (!tutorToken) {
//         return NextResponse.json(
//           { error: "Unauthorized tutor" },
//           { status: 401 }
//         );
//       }

//       const decoded = jwt.verify(
//         tutorToken,
//         process.env.JWT_SECRET!
//       ) as { id: string };

//       const tutor = await prisma.tutor.findUnique({
//         where: { id: decoded.id },
//         select: { name: true },
//       });

//       if (!tutor) {
//         return NextResponse.json(
//           { error: "Tutor not found" },
//           { status: 404 }
//         );
//       }

//       userName = tutor.name || "Tutor";
//     }

//     /* =========================
//        STUDENT (NextAuth)
//     ========================= */
//     else {
//       const nextAuthToken = await getToken({
//         req,
//         secret: process.env.NEXTAUTH_SECRET!,
//       });

//       if (!nextAuthToken?.id) {
//         return NextResponse.json(
//           { error: "Unauthorized" },
//           { status: 401 }
//         );
//       }

//       /* ✅ PAYMENT BLOCK CHECK (IMPORTANT) */
//       const access = await checkStudentAccess(
//         nextAuthToken.id as string
//       );

//       if (!access.allowed) {
//         return NextResponse.json(
//           {
//             error:
//               access.reason === "ACCOUNT_SUSPENDED"
//                 ? "Your account is suspended."
//                 : "Please complete your pending payment first.",
//           },
//           { status: 403 }
//         );
//       }

//       /* ✅ USER NAME */
//       userName = (nextAuthToken.name as string) || "Student";
//     }

//     /* =========================
//        LIVEKIT TOKEN
//     ========================= */
//     const at = new AccessToken(
//       process.env.LIVEKIT_API_KEY!,
//       process.env.LIVEKIT_API_SECRET!,
//       {
//         identity: userName,
//       }
//     );

//     at.addGrant({
//       roomJoin: true,
//       room,
//       canPublish: true,
//       canSubscribe: true,
//     });

//     const token = await at.toJwt();

//     console.log("LIVEKIT TOKEN GENERATED FOR:", userName);

//     return NextResponse.json({
//       token,
//       identity: userName,
//     });

//   } catch (err) {
//     console.error("TOKEN ERROR:", err);

//     return NextResponse.json(
//       { error: "Failed to generate token" },
//       { status: 500 }
//     );
//   }
// }