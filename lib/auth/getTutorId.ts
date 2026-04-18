import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getTutorId() {
  const token = cookies().get("tutor_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    return decoded.id;
  } catch (err) {
    return null;
  }
}
