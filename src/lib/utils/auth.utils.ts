import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getNextAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(
    process.env.NEXT_AUTH_SESSION_TOKEN ?? "",
  )?.value;

  try {
    const jwt = await decode({
      token: token ?? "",
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    return jwt;
  } catch (error) {
    console.error(error);
    return null;
  }
}
