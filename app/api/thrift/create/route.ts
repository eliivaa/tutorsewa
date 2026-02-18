import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();

    const title = data.get("title") as string;
    const subject = data.get("subject") as string;
    const condition = data.get("condition") as string;
    const grade = data.get("grade") as string;
    const price = Number(data.get("price"));
    const contact = data.get("contact") as string;
    const image = data.get("image") as string | null;

    await prisma.thriftItem.create({
      data: {
        title,
        subject,
        condition,
        grade,
        price,
        contact,
        image,
        sellerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
