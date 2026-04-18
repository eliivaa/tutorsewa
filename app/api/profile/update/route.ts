// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const { name, phone, grade } = await req.json();

//   await prisma.user.update({
//     where: { id: session.user.id },
//     data: { name, phone, grade },
//   });

//   return NextResponse.json({ success: true });
// }

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name, phone, grade } = await req.json();

  /* ================= VALIDATION ================= */

  if (!name?.trim() || !phone?.trim() || !grade?.trim()) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Name validation
  if (name.trim().length < 3) {
    return NextResponse.json(
      { error: "Name must be at least 3 characters" },
      { status: 400 }
    );
  }

  // Nepal phone validation
  const nepalPhoneRegex =
    /^(984|985|986|974|975|980|981|982|970|961|962)[0-9]{7}$/;

  if (!nepalPhoneRegex.test(phone)) {
    return NextResponse.json(
      {
        error:
          "Enter a valid Nepal mobile number (NTC / Ncell / Smart Telecom)",
      },
      { status: 400 }
    );
  }

  /* ================= UPDATE ================= */

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      phone: phone.trim(),
      grade: grade.trim(),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully.",
  });
}