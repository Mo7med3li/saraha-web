import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

/** Prefer env, then try both production and local NextAuth cookie names. */
function sessionCookieNames(): string[] {
  const names = [
    process.env.NEXT_AUTH_SESSION_TOKEN,
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
  ].filter((name): name is string => Boolean(name?.trim()));

  return [...new Set(names)];
}

export async function getNextAuthToken() {
  const cookieStore = await cookies();

  let raw: string | undefined;
  for (const name of sessionCookieNames()) {
    raw = cookieStore.get(name)?.value;
    if (raw) break;
  }

  if (!raw) {
    return null;
  }

  try {
    return await decode({
      token: raw,
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
