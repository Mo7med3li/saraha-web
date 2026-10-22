import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import getSignature from "@/src/lib/utils/get-signature.utils";
import { JWT } from "next-auth/jwt";

const ACCESS_TOKEN_LIFETIME_MS = 30 * 60 * 1000; // 30 minutes

export const refreshTokenApi = async (jwt: JWT) => {
  // Pass the role from the decoded JWT — getSignature is now a pure function
  // safe for Edge Runtime (no getServerSession / Node.js APIs).
  const signature = getSignature(jwt?.user?.role);

  try {
    const response = await fetch(
      `${process.env.DATABASE_URL}/users/refresh-token`,
      {
        method: "GET",
        headers: {
          ...JSON_HEADER,
          Authorization: `${signature} ${jwt?.refreshToken}`,
        },
      },
    );

    const payload: ApiResponse<ILoginResponse> = await response.json();

    if (!payload?.success) {
      throw new Error(
        typeof payload.message === "string"
          ? payload.message
          : (payload?.message?.[0]?.message ?? "Failed to refresh token"),
      );
    }

    if (payload?.success && payload?.data) {
      return {
        ...jwt,
        token: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
        accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME_MS,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to refresh token in proxy:", error);
    return null;
  }
};
