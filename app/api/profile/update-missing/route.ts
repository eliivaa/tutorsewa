// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.email)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { phone, grade } = await req.json();

//   await prisma.user.update({
//     where: { email: session.user.email },
//     data: { phone, grade },
//   });

//   return NextResponse.json({ success: true });
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // User must be logged in through NextAuth
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone, grade } = await req.json();

  // Save to database
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      phone,
      grade,
    },
  });

  return NextResponse.json({ success: true });
}
