"use server";

import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";

export async function replyMessageAction(
  messageId: string,
  formData: FormData,
) {
  if (!messageId?.trim()) {
    throw new Error("Message is required");
  }

  const token = await getNextAuthToken();
  if (!token?.token) {
    throw new Error("Unauthorized");
  }

  const signature = getSignature(token.user?.role);

  const response = await fetch(
    `${process.env.DATABASE_URL}/messages/${messageId}/reply`,
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
        : (payload?.message?.[0]?.message ?? "Failed to send reply"),
    );
  }

  return payload.message;
}
