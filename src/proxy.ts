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

// On HTTPS (Vercel) NextAuth always uses the __Secure- cookie name.
// Do not honor a localhost cookie name from env in production — that caused
// logout/login redirect loops.
function getSessionCookieName(): string {
  if (process.env.NODE_ENV === "production") {
    return "__Secure-next-auth.session-token";
  }
  return (
    process.env.NEXT_AUTH_SESSION_TOKEN?.trim() || "next-auth.session-token"
  );
}

function clearSessionCookies(res: NextResponse) {
  res.cookies.set("next-auth.session-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("__Secure-next-auth.session-token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
  });
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

  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(getSessionCookieName(), encodedToken, {
    httpOnly: true,
    secure,
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
        redirectUrl.searchParams.set("callbackUrl", pathname);
        const res = NextResponse.redirect(redirectUrl);
        clearSessionCookies(res);
        return res;
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
    // Session cookie exists but has no usable access token → clear and stay on login
    if (!jwt.token) {
      const res = NextResponse.next();
      clearSessionCookies(res);
      return res;
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
