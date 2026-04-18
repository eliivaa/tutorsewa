import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    /* ================= DELETE USER ================= */
    // await prisma.user.delete({
    //   where: { id: userId },
    // });

    await prisma.user.update({
  where: { id: userId },
 data: {
  status: "SUSPENDED",
  suspendedBy: "USER",
},
});

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);

    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}