// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/prisma";

// export async function getTutorFromToken(req: Request) {
//   const cookie = req.headers.get("cookie") || "";
//   const token = cookie.split("token=")[1];

//   if (!token) return null;

//   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//     id: string;
//     role: string;
//   };

//   if (decoded.role !== "TUTOR") return null;

//   return prisma.tutor.findUnique({
//     where: { id: decoded.id },
//   });
// }
