import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

export async function adminLog(
  category: "REGISTER" | "PAYMENT" | "SESSION" | "SYSTEM",
  title: string,
  message: string,
  type: NotificationType = "SYSTEM_ANNOUNCEMENT",
  actionUrl?: string
) {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        type,
        actionUrl,
        isForAdmin: true,
        adminCategory: category,
      },
    });
  } catch (err) {
    console.error("ADMIN LOG ERROR:", err);
  }
}
