// after thrift

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getCurrentUserId} from "@/lib/auth/getCurrentUserId";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { conversationId: string } }
// ) {
//   const userId = await getCurrentUserId();
//   if (!userId) {
//     return NextResponse.json({ messages: [] });
//   }

//   const conversation = await prisma.conversation.findUnique({
//     where: { id: params.conversationId },
//   });

//   // ⭐ allow BOTH student and seller to read
//   const isParticipant =
//     conversation &&
//     (conversation.studentId === userId ||
//       conversation.thriftUserId === userId);

//   if (!isParticipant) {
//     return NextResponse.json({ messages: [] }, { status: 403 });
//   }

//   const messages = await prisma.message.findMany({
//     where: { conversationId: conversation.id },
//     orderBy: { createdAt: "asc" },
//   });

//   return NextResponse.json({
//     messages,
//     conversationId: conversation.id,
//   });
// }


// after due payment

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { checkStudentAccess } from "@/lib/paymentGuard";

/* ================= GET (READ MESSAGES) ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ messages: [] });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  const isParticipant =
    conversation &&
    (conversation.studentId === userId ||
      conversation.thriftUserId === userId);

  if (!isParticipant) {
    return NextResponse.json({ messages: [] }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    messages,
    conversationId: conversation.id,
  });
}

/* ================= POST (SEND MESSAGE) ================= */
export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { content } = await req.json();

  if (!content) {
    return NextResponse.json(
      { error: "Message content required" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const isStudent = conversation.studentId === userId;

  /* ✅ BLOCK ONLY STUDENTS */
 if (isStudent && conversation.type === "TUTOR_SESSION") {
  const now = new Date();

  // 🚨 1. Block ONLY overdue payments
  const overdueBooking = await prisma.booking.findFirst({
    where: {
      studentId: userId,
      tutorId: conversation.tutorId!,
      status: {
        in: ["COMPLETED", "EXPIRED"],
      },
      paymentStatus: "PARTIALLY_PAID",
      paymentDueAt: {
        not: null,
        lt: now,
      },
    },
  });

  if (overdueBooking) {
    return NextResponse.json(
      {
        error: "PAYMENT_OVERDUE",
        message:
          "You have unpaid dues. Please complete your payment to continue chatting.",
      },
      { status: 403 }
    );
  }

  // 🔍 2. Ensure tutor has accepted booking
const validBooking = await prisma.booking.findFirst({
  where: {
    studentId: userId,
    tutorId: conversation.tutorId!,

    // ✅ allow any accepted/history booking except rejected
    status: {
      notIn: ["REJECTED"],
    },
  },
});

if (!validBooking) {
  return NextResponse.json(
    { error: "CHAT_LOCKED_UNTIL_TUTOR_ACCEPTS_BOOKING" },
    { status: 403 }
  );
}
}

  /* ================= CREATE MESSAGE ================= */
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderUserId: userId,
      content,
    },
  });

  return NextResponse.json({ message });
}