"use server";

import { JSON_HEADER } from "@/src/lib/constants/api.constant";
import { SendOtpFields } from "../_schema/send-otp.schema";

export const sendOtpAction = async (data: SendOtpFields) => {
  const response = await fetch(
    `${process.env.DATABASE_URL}/auth/send-forgot-password-otp`,
    {
      method: "PATCH",
      headers: { ...JSON_HEADER },
      body: JSON.stringify(data),
    },
  );

  const payload: APIResponseNoData<SendOtpFields> = await response.json();

  if (!payload?.success) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to send OTP"),
    );
  }
  return payload.success;
};
