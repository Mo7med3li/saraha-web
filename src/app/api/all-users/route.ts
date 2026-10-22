import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import getSignature from "@/src/lib/utils/get-signature.utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const signature = getSignature(token?.user?.role);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const response = await fetch(`${process.env.DATABASE_URL}/users/all`, {
    next: {
      tags: ["user-profile"],
    },
    headers: {
      ...JSON_HEADER,
      Authorization: `${signature} ${token.token}`,
    },
  });

  const payload = await response.json();

  return NextResponse.json(payload);
}
