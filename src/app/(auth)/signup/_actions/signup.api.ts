"use server";
import { RegistrationFields } from "../_schema/signup.schema";

export const signupApi = async (data: RegistrationFields) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to signup");
  }
  const payload: ApiResponse<ISignupData> = await response.json();
  if (!payload?.success) {
    throw new Error(payload.message);
  }
  return payload.data;
};
