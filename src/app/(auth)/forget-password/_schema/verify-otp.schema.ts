import z from "zod";

export const verifyOtpSchema = z.object({
  email: z.email({
    message: "Email is invalid",
  }),
  otp: z
    .string()
    .min(6, { message: " OTP is required" })
    .max(6, " OTP must be 6 digits"),
});

export type VerifyOtpFields = z.infer<typeof verifyOtpSchema>;
