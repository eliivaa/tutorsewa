// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const bookings = await prisma.booking.findMany({
//     where: { studentId: session.user.id },
//     include: { tutor: true },
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json({ bookings });
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    include: {
      tutor: {
       select: {
        name: true,
        photo: true,   
      },
    },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
