"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";

export const deleteAccountAction = async (targetUserId: string) => {
  const token = await getNextAuthToken();
  const signature = getSignature(token?.user?.role);

  // Helper to call delete
  const callDelete = async () => {
    return await fetch(`${process.env.DATABASE_URL}/users/${targetUserId}`, {
      method: "DELETE",
      headers: {
        ...JSON_HEADER,
        Authorization: `${signature} ${token?.token}`,
      },
    });
  };

  let response = await callDelete();
  let payload: APIResponseNoData<unknown> = await response.json();

  // If backend requires the account to be frozen first
  if (
    !payload?.success &&
    typeof payload.message === "string" &&
    payload.message.toLowerCase().includes("not freezed")
  ) {
    // Freeze account first
    await fetch(
      `${process.env.DATABASE_URL}/users/${targetUserId}/freeze-account`,
      {
        method: "DELETE",
        headers: {
          ...JSON_HEADER,
          Authorization: `${signature} ${token?.token}`,
        },
      },
    );
    // Retry permanent deletion
    response = await callDelete();
    payload = await response.json();
  }

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to delete account"),
    );
  }

  return payload.message;
};
