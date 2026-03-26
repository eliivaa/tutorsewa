// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const booking = await prisma.booking.findUnique({
//   where: { id: params.id },
//   include: {
//     tutor: { select: { name: true, photo: true } },
//     payments: true,
//   },
// });


//   if (!booking) {
//     return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//   }

//   if (booking.studentId !== session.user.id) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   return NextResponse.json({ booking });
// }


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ USE NEXTAUTH (NOT JWT)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        tutor: { select: { name: true, photo: true } },
        payments: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // ✅ ENSURE STUDENT OWNS BOOKING
    if (booking.studentId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ booking });

  } catch (err) {
    console.error("GET BOOKING ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}