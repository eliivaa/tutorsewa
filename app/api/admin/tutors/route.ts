import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        photo: true,
        subjects: true,
        experience: true,
        status: true
      }
    });

    return NextResponse.json({ tutors });

  } catch (err) {
    console.error("❗ ERROR FETCHING TUTORS:", err);
    return NextResponse.json({ tutors: [] }, { status: 500 });
  }
}
