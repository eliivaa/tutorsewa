import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {

  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@tutorsewa.com" },
    update: {},
    create: {
      email: "admin@tutorsewa.com",
      password: hashed,
      role: "ADMIN",
    },
  });

  return Response.json({ message: "Admin created!" });
}
