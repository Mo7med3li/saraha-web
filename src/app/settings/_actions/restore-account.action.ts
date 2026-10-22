"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";

export const restoreAccountAction = async (targetUserId: string) => {
  const token = await getNextAuthToken();
  const signature = getSignature(token?.user?.role);

  const response = await fetch(
    `${process.env.DATABASE_URL}/users/${targetUserId}/restore-account`,
    {
      method: "PATCH",
      headers: {
        ...JSON_HEADER,
        Authorization: `${signature} ${token?.token}`,
      },
    },
  );

  const payload: APIResponseNoData<unknown> = await response.json();

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to restore account"),
    );
  }

  return payload.message;
};
