import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const privatePages = new Set(["/dashboard"]);
const authPages = new Set([
  "/login",
  // "/register",
  // "/forgot-password",
  // "/reset-password",
]);

export default async function proxy(req: NextRequest) {
  const jwt = await getToken({
    req,
    // secret: process.env.NEXTAUTH_SECRET,
  });
  const pathname = req.nextUrl.pathname;

  if (privatePages.has(pathname)) {
    if (jwt) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/login", req.nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (authPages.has(pathname)) {
    if (!jwt) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
