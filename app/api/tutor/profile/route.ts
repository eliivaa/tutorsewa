import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/* ======================
   GET TUTOR ID
====================== */
function getTutorId(req: NextRequest) {
  const token = req.cookies.get("tutor_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    return decoded.id;
  } catch {
    return null;
  }
}

/* ======================
   GET TUTOR PROFILE
====================== */
export async function GET(req: NextRequest) {
  const tutorId = getTutorId(req);

  if (!tutorId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      subjects: true,
    },
  });

  if (!tutor) {
    return NextResponse.json(
      { error: "Tutor not found" },
      { status: 404 }
    );
  }

  // Convert DB → frontend format
  const formattedTutor = {
    ...tutor,
    subjects: tutor.subjects.map(
      (s) => `${s.subject}|${s.level || ""}`
    ),
  };

  return NextResponse.json({ tutor: formattedTutor });
}

/* ======================
   UPDATE PROFILE
====================== */
export async function PUT(req: NextRequest) {
  const tutorId = getTutorId(req);

  if (!tutorId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

const body = await req.json();

const name: string = body.name;
const bio: string = body.bio;
const subjects: string[] = body.subjects || [];
const rate: number = body.rate;
const experience: string = body.experience;

  console.log("SUBJECTS RECEIVED:", subjects);

  try {
    /* ======================
       STEP 1: UPDATE BASIC INFO
    ======================= */
    await prisma.tutor.update({
      where: { id: tutorId },
      data: {
        name,
        bio,
        rate,
        experience,
      },
    });

    /* ======================
       STEP 2 & 3: HANDLE SUBJECTS SAFELY
    ======================= */
    if (subjects && subjects.length > 0) {

      /* DELETE OLD SUBJECTS ONLY IF NEW ONES EXIST */
      await prisma.tutorSubject.deleteMany({
        where: { tutorId },
      });

      /* NORMALIZE + CLEAN */
    const cleanSubjects: {
  tutorId: string;
  subject: string;
  level: string | null;
}[] = subjects
  .map((s: string) => {
    if (typeof s !== "string") return null;

    const parts = s.split("|");

   const subject = parts[0]?.trim();
const level = parts[1]?.trim() || null;

    if (!subject) return null;

    return {
      tutorId,
      subject,
      level,
    };
  })
  .filter(
    (s): s is {
      tutorId: string;
      subject: string;
      level: string | null;
    } => s !== null
  );

      /* REMOVE DUPLICATES */
    const uniqueSubjects = Array.from(
  new Map(
    cleanSubjects.map(s => [
      `${s.subject.toLowerCase()}|${s.level?.toLowerCase()}`,
      s,
    ])
  ).values()
);
      console.log("SUBJECTS TO SAVE:", uniqueSubjects);

      /* INSERT SAFELY */
      if (uniqueSubjects.length > 0) {
        await prisma.tutorSubject.createMany({
          data: uniqueSubjects,
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}