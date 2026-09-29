"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { ResetPasswordFields } from "../_schema/reset-password.schema";

export const resetPasswordAction = async (data: ResetPasswordFields) => {
  const response = await fetch(
    `${process.env.DATABASE_URL}/auth/reset-password`,
    {
      method: "PATCH",
      headers: { ...JSON_HEADER },
      body: JSON.stringify(data),
    },
  );

  const payload: APIResponseNoData<ResetPasswordFields> = await response.json();
  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to confirm email"),
    );
  }
  return payload.success;
};
