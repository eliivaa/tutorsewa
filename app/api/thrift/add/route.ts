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
    const location = data.get("location") as string;

    const imageRaw = data.get("image");
    const image = typeof imageRaw === "string" ? imageRaw : null;

    /* ===== VALIDATION ===== */
    if (
      !title ||
      !subject ||
      !condition ||
      !grade ||
      !price ||
      !contact ||
      !location
    ) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    /* ===== PHONE VALIDATION ===== */
    const validPrefixes = [
      "984","985","986","974","975",
      "980","981","982","970",
      "961","962",
    ];

    const isValidPhone =
      /^9\d{9}$/.test(contact) &&
      validPrefixes.some((p) => contact.startsWith(p));

    if (!isValidPhone) {
      return NextResponse.json(
        { error: "Invalid Nepal phone number" },
        { status: 400 }
      );
    }

    /* ===== CREATE ===== */
    await prisma.thriftItem.create({
      data: {
        title,
        subject,
        condition,
        grade,
        price,
        contact,
        location,
        image,
        sellerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}