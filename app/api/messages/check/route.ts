// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function GET(req: NextRequest) {
//   console.log("CHECK ROUTE HIT");

//   const studentId = await getStudentId();
//   console.log("Student ID:", studentId);

//   const tutorId = new URL(req.url).searchParams.get("tutorId");

//   if (!studentId || !tutorId) {
//     console.log("Missing student or tutor ID");
//     return NextResponse.json({ canChat: false }, { status: 403 });
//   }

//   console.log("Tutor ID:", tutorId);

//   const bookings = await prisma.booking.findMany({
//     where: {
//       studentId,
//       tutorId,
//     },
//   });

//   console.log("Bookings Found:", bookings);

//   return NextResponse.json({ canChat: true });
// }
