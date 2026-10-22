"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";

export const freezeAccountAction = async (targetUserId?: string) => {
  const token = await getNextAuthToken();
  const signature = getSignature(token?.user?.role);

  // If targetUserId is supplied (e.g. by admin) use /users/:id/freeze-account, else /users/freeze-account
  const endpoint = targetUserId
    ? `${process.env.DATABASE_URL}/users/${targetUserId}/freeze-account`
    : `${process.env.DATABASE_URL}/users/freeze-account`;

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      ...JSON_HEADER,
      Authorization: `${signature} ${token?.token}`,
    },
  });

  const payload: APIResponseNoData<unknown> = await response.json();

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to freeze account"),
    );
  }

  return payload.message;
};
