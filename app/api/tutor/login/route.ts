// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     const tutor = await prisma.tutor.findUnique({
//       where: { email },
//     });

//     if (!tutor)
//       return NextResponse.json({ error: "Tutor not found" }, { status: 404 });

//     const valid = await bcrypt.compare(password, tutor.password);
//     if (!valid)
//       return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

//     // generate token
//     const token = jwt.sign(
//       {
//         id: tutor.id,
//         email: tutor.email,
//         role: "TUTOR",
//         status: tutor.status,
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // set cookie
//     const response = NextResponse.json({
//       success: true,
//     });

//  response.cookies.set("tutor_token", token, {
//   httpOnly: true,
//   secure: false,
//   maxAge: 60 * 60 * 24 * 7, // 7 days
//   path: "/",
// });



//     return response;

//   } catch (error) {
//     console.log("LOGIN ERROR:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const tutor = await prisma.tutor.findUnique({
      where: { email },
    });

    if (!tutor)
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });

    const valid = await bcrypt.compare(password, tutor.password);
    if (!valid)
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

    // generate token
    const token = jwt.sign(
      {
        id: tutor.id,
        email: tutor.email,
        role: "TUTOR",
        status: tutor.status,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // set cookie
    const response = NextResponse.json({
      success: true,
    });

 response.cookies.set("tutor_token", token, {
  httpOnly: true,
  secure: false,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
});



    return response;

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}