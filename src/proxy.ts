import { encode, getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { refreshTokenApi } from "./lib/api/refresh-token.api";

const privatePages = new Set(["/", "/dashboard", "/settings"]);
const authPages = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/forget-password",
]);

// Resolves the correct NextAuth session cookie name.
// NextAuth automatically prefixes with "__Secure-" in production (HTTPS).
function getSessionCookieName(): string {
  if (process.env.NEXT_AUTH_SESSION_TOKEN) {
    return process.env.NEXT_AUTH_SESSION_TOKEN;
  }
  return process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
}

// Checks the BACKEND access token's real expiry — not NextAuth's own `exp`
// claim, which NextAuth recalculates on every re-encode and can't be
// repurposed for this.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTokenExpired(token: any): boolean {
  if (
    !token ||
    !token.accessTokenExpires ||
    typeof token.accessTokenExpires !== "number"
  ) {
    return false;
  }
  return Date.now() >= token.accessTokenExpires;
}

// Re-encodes a refreshed JWT and writes it back as the session cookie.
async function applyRefreshedToken(
  res: NextResponse,
  newToken: JWT,
): Promise<NextResponse> {
  const encodedToken = await encode({
    token: newToken,
    secret: process.env.NEXTAUTH_SECRET ?? "",
  });

  res.cookies.set(getSessionCookieName(), encodedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}

export default async function middleware(req: NextRequest) {
  const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // --- Private pages ---
  if (privatePages.has(pathname)) {
    if (!jwt) {
      const redirectUrl = new URL("/login", req.nextUrl.origin);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isTokenExpired(jwt)) {
      const newToken = await refreshTokenApi(jwt);

      if (!newToken) {
        const redirectUrl = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(redirectUrl);
      }

      return applyRefreshedToken(NextResponse.next(), newToken);
    }

    return NextResponse.next();
  }

  // --- Auth pages (login/register/etc.) ---
  if (authPages.has(pathname)) {
    if (!jwt) {
      return NextResponse.next();
    }
    const redirectUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  // --- All other pages: refresh silently if needed, but don't block/redirect ---
  if (jwt && isTokenExpired(jwt)) {
    const newToken = await refreshTokenApi(jwt);
    if (newToken) {
      return applyRefreshedToken(NextResponse.next(), newToken);
    }
    // Refresh failed on a public page — let the request through unauthenticated
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
