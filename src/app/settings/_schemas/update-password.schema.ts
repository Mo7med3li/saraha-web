import { LOGOUT_ENUM } from "@/src/lib/constants/api.constant";
import z from "zod";

export const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .trim()
      .min(1, { message: "password is required" })
      .min(8, { message: "password must be at least 8 characters" }),
    newPassword: z
      .string()
      .min(1, { message: "password is required" })
      .min(8, {
        message: "password must be at least 8 characters",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    flag: z.enum(
      [
        LOGOUT_ENUM.STAY_LOGGED_IN,
        LOGOUT_ENUM.SIGNED_OUT_FROM_CURRENT_DEVICE,
        LOGOUT_ENUM.SIGNED_OUT_FROM_ALL,
      ] as const,
      {
        message: "Please select a session management option",
      },
    ),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

export type UpdatePasswordFields = z.infer<typeof updatePasswordSchema>;
