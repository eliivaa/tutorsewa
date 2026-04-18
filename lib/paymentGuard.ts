import { prisma } from "@/lib/prisma";

export async function checkStudentAccess(userId: string) {
  console.log("🔍 CHECK ACCESS for user:", userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.log("❌ User not found");
    return { allowed: false };
  }

  if (user.status === "SUSPENDED") {
    console.log("🚫 BLOCKED: USER SUSPENDED");
    return { allowed: false, reason: "ACCOUNT_SUSPENDED" };
  }

  const pending = await prisma.payment.findFirst({
    where: {
      booking: { studentId: userId },
      status: "REMAINING_DUE",
    },
  });

  if (pending) {
    console.log("🚫 BLOCKED: PENDING PAYMENT", pending.id);
    return { allowed: false, reason: "PENDING_PAYMENT" };
  }

  console.log("✅ ACCESS ALLOWED");
  return { allowed: true };
}