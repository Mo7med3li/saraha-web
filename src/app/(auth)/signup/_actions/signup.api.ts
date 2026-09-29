"use server";
import { RegistrationFields } from "../_schema/signup.schema";
import { EmailNotSentError } from "../_errors/signup.errors";
import { JSON_HEADER } from "@/src/lib/constants/api.constant";

export const signupApi = async (data: RegistrationFields) => {
  const response = await fetch(`${process.env.DATABASE_URL}/auth/signup`, {
    method: "POST",
    headers: { ...JSON_HEADER },
    body: JSON.stringify(data),
  });

  const payload: ApiResponse<RegistrationFields> = await response.json();

  // Detect partial-success: user created but email delivery failed
  const isEmailFailure =
    typeof payload?.message === "string" &&
    payload.message.toLowerCase().includes("failed to send confirmation email");

  if (isEmailFailure) {
    throw new EmailNotSentError(
      (typeof payload.message === "string" && payload.message) || "",
    );
  }

  if (!response.ok) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to signup"),
    );
  }

  if (!payload?.success) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : (payload?.message?.[0]?.message ?? "Failed to signup"),
    );
  }

  return payload.data;
};
