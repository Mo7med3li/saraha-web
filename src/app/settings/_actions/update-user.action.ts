"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { getNextAuthToken } from "@/src/lib/utils/auth.utils";
import getSignature from "@/src/lib/utils/get-signature.utils";
import { UpdateProfileFields } from "../_schemas/update-profile.schema";

export const updateUserAction = async (data: UpdateProfileFields) => {
  // token & signature
  const signature = await getSignature();
  const token = await getNextAuthToken();

  const response = await fetch(`${process.env.DATABASE_URL}/users`, {
    method: "PATCH",
    headers: { ...JSON_HEADER, Authorization: `${signature} ${token?.token}` },
    body: JSON.stringify(data),
  });

  const payload: APIResponseNoData<UpdateProfileFields> = await response.json();

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to confirm email"),
    );
  }
  return payload.message;
};
