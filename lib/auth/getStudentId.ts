import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getStudentId() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return session.user.id;
}
