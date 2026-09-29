import z from "zod";

export const confirmEmailSchema = z.object({
  email: z.email({
    message: "Email is invalid",
  }),
  otp: z
    .string()
    .min(6, { message: " OTP is required" })
    .max(6, " OTP must be 6 digits"),
});

export type ConfirmEmailFields = z.infer<typeof confirmEmailSchema>;
