"use server";

import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";

export async function sendMessageAction(
  receiverId: string,
  formData: FormData,
  options?: { identified?: boolean },
) {
  if (!receiverId?.trim()) {
    throw new Error("Receiver is required");
  }

  const identified = Boolean(options?.identified);

  if (identified) {
    const token = await getNextAuthToken();
    if (!token?.token) {
      throw new Error("You must be logged in to send as yourself");
    }

    const signature = getSignature(token.user?.role);
    const response = await fetch(
      `${process.env.DATABASE_URL}/messages/${receiverId}/sender`,
      {
        method: "POST",
        headers: {
          Authorization: `${signature} ${token.token}`,
        },
        body: formData,
      },
    );

    const payload: ApiResponse<unknown> = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(
        typeof payload?.message === "string"
          ? payload.message
          : (payload?.message?.[0]?.message ?? "Failed to send message"),
      );
    }

    return payload.message;
  }

  const response = await fetch(
    `${process.env.DATABASE_URL}/messages/${receiverId}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload: ApiResponse<unknown> = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to send message"),
    );
  }

  return payload.message;
}
