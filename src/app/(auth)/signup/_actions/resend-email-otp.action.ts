"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { ResendEmailFields } from "../_schema/resend-email-otp.schema";

export const resendEmailAction = async (data: ResendEmailFields) => {
  const response = await fetch(
    `${process.env.DATABASE_URL}/auth/resend-confirm-email-otp`,
    {
      method: "PATCH",
      headers: { ...JSON_HEADER },
      body: JSON.stringify(data),
    },
  );

  const payload: APIResponseNoData<ResendEmailFields> = await response.json();
  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to confirm email"),
    );
  }
  return payload.success;
};
