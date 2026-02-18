// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentId } from "@/lib/auth/getStudentId";

// export async function POST(req: Request) {
//   try {
//     console.log("THRIFT CHAT STARTED");

//     const studentId = await getStudentId();
//     console.log("studentId:", studentId);

//     if (!studentId)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     console.log("body:", body);

//     const { itemId } = body;

//     const item = await prisma.thriftItem.findUnique({
//       where: { id: itemId },
//     });

//     console.log("item:", item);

//     if (!item)
//       return NextResponse.json({ error: "Item not found" }, { status: 404 });

//     const conversation = await prisma.conversation.create({
//   data: {
//     studentId,
//     thriftUserId: item.sellerId,
//     type: "THRIFT",
//     thriftItemId: item.id,
//   },
// });


//     console.log("conversation created:", conversation.id);

//     return NextResponse.json({ conversationId: conversation.id });

//   } catch (err) {
//     console.error("🔥 THRIFT CHAT CRASH:", err);
//     return NextResponse.json({ error: "Server crashed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

export async function POST(req: Request) {
  try {
    console.log("🛒 THRIFT CHAT START");

    const studentId = await getCurrentUserId();
    if (!studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await req.json();
    if (!itemId) {
      return NextResponse.json({ error: "ItemId required" }, { status: 400 });
    }

    // 1️⃣ Get item
    const item = await prisma.thriftItem.findUnique({
      where: { id: itemId },
      select: { id: true, sellerId: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 2️⃣ Prevent chatting with yourself
    if (item.sellerId === studentId) {
      return NextResponse.json(
        { error: "You cannot chat with your own item" },
        { status: 400 }
      );
    }

    // 3️⃣ IMPORTANT — find existing conversation first
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        studentId,
        thriftUserId: item.sellerId,
        thriftItemId: item.id,
        type: "THRIFT",
      },
      select: { id: true },
    });

    if (existingConversation) {
      console.log("♻️ Reusing existing convo:", existingConversation.id);
      return NextResponse.json({ conversationId: existingConversation.id });
    }

    // 4️⃣ Create new conversation only if not exists
    const newConversation = await prisma.conversation.create({
      data: {
        studentId,
        thriftUserId: item.sellerId,
        thriftItemId: item.id,
        type: "THRIFT",
      },
    });

    console.log("✅ New thrift convo:", newConversation.id);

    return NextResponse.json({ conversationId: newConversation.id });

  } catch (err) {
    console.error("🔥 THRIFT CHAT ERROR:", err);
    return NextResponse.json({ error: "Server crashed" }, { status: 500 });
  }
}
