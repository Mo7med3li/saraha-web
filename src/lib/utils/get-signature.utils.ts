import { authOptions } from "@/src/auth";
import { getServerSession } from "next-auth";

export default async function getSignature() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "user" ? "Bearer" : "System";
}
