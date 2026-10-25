import { getUserMessages } from "@/src/lib/api/get-user-messages.api";
import getSignature from "@/src/lib/utils/get-signature.utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { userId } = await params;
  const page = req.nextUrl.searchParams.get("page") ?? "1";
  const limit = req.nextUrl.searchParams.get("limit") ?? "10";

  const payload = await getUserMessages({
    userId,
    page,
    limit,
    signature: getSignature(token.user?.role),
    token: token.token,
  });

  return NextResponse.json(payload);
}
