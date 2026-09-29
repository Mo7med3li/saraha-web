import z from "zod";

export const resetPasswordSchema = z
  .object({
    email: z.email({
      message: "Email is invalid",
    }),
    otp: z
      .string()
      .min(6, { message: " OTP is required" })
      .max(6, " OTP must be 6 digits"),
    password: z
      .string()
      .min(1, { message: "password is required" })
      .min(8, {
        message: "password must be at least 8 characters",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z.string().min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password should be the same ",
    path: ["confirmPassword"],
  });

export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>;
