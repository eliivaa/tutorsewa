import { BookingStatus } from "@prisma/client";

/* =====================
   ALLOWED TO MESSAGE
===================== */
export function canMessage(status: BookingStatus): boolean {
  const allowed: BookingStatus[] = [
    BookingStatus.PAYMENT_PENDING,
    BookingStatus.PARTIALLY_PAID,
    BookingStatus.FULLY_PAID,
    BookingStatus.CONFIRMED,
    BookingStatus.READY,
    BookingStatus.COMPLETED,
    BookingStatus.EXPIRED,
  ];

  return allowed.includes(status);
}

/* =====================
   BLOCKED STATUSES
===================== */
export function isBlockedStatus(status: BookingStatus): boolean {
  const blocked: BookingStatus[] = [
    BookingStatus.REQUESTED,
    BookingStatus.REJECTED,
  ];

  return blocked.includes(status);
}
