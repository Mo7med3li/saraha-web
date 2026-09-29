"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { ConfirmEmailFields } from "../_schema/confirm-email.schema";

export const confirmEmailAction = async (data: ConfirmEmailFields) => {
  const response = await fetch(
    `${process.env.DATABASE_URL}/auth/confirm-email`,
    {
      method: "PATCH",
      headers: { ...JSON_HEADER },
      body: JSON.stringify(data),
    },
  );

  const payload: APIResponseNoData<ConfirmEmailFields> = await response.json();
  console.log("payload", payload);

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to confirm email"),
    );
  }
  return payload.success;
};
