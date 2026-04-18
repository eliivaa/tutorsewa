import { prisma } from "../lib/prisma";

async function migrate() {
  console.log("🚀 Starting earnings migration...");

  const payments = await prisma.payment.findMany({
    where: {
      status: {
        in: ["HALF_PAID", "FULL_PAID"],
      },
    },
    include: {
      booking: true,
    },
  });

  console.log(`Found ${payments.length} payments`);

  for (const p of payments) {
    // check if already exists
    const exists = await prisma.tutorEarning.findFirst({
      where: {
        bookingId: p.bookingId,
      },
    });

    if (exists) {
      console.log(`⏭ Skipping booking ${p.bookingId} (already exists)`);
      continue;
    }

    const tutorAmount = Math.round(p.amount * 0.85);

    await prisma.tutorEarning.create({
      data: {
        tutorId: p.booking.tutorId,
        bookingId: p.bookingId,
        amount: tutorAmount,
        type: "COMPLETION",
      },
    });

    console.log(`✅ Created earning for booking ${p.bookingId}`);
  }

  console.log("🎉 Migration completed!");
}

migrate()
  .catch((err) => {
    console.error("❌ Error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });