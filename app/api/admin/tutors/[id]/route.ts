// new

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    const tutor = await prisma.tutor.findUnique({
      where: { id: params.id },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        photo: true,
        subjects: true,
        experience: true,
        cvUrl: true,
        idUrl: true,
        status: true,

        rejectionReason: true,
        suspensionReason: true
      }
    });

    if (!tutor) {
      return NextResponse.json({ tutor: null }, { status: 404 });
    }

    return NextResponse.json({ tutor });

  } catch (err) {

    console.error("FETCH TUTOR ERROR:", err);

    return NextResponse.json({ tutor: null }, { status: 500 });

  }
}