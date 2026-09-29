"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { VerifyOtpFields } from "../_schema/verify-otp.schema";

export const verifyOtpAction = async (data: VerifyOtpFields) => {
  const response = await fetch(
    `${process.env.DATABASE_URL}/auth/verify-forgot-password-otp`,
    {
      method: "PATCH",
      headers: { ...JSON_HEADER },
      body: JSON.stringify(data),
    },
  );

  const payload: APIResponseNoData<VerifyOtpFields> = await response.json();

  if (!payload?.success) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to verify OTP"),
    );
  }

  return payload.success;
};
