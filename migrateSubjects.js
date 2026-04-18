import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tutors = await prisma.tutor.findMany();

  for (const t of tutors) {
    if (!t.subjects) continue;

    for (const s of t.subjects) {
      const [subject, level] = s.split("|");

      await prisma.tutorSubject.create({
        data: {
          tutorId: t.id,
          subject,
          level: level || null,
        },
      });
    }
  }

  console.log("Migration done");
}

main().finally(() => prisma.$disconnect());