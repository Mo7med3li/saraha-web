import { LOGOUT_ENUM } from "@/src/lib/constants/api.constant";
import z from "zod";

export const updatePasswordSchema = z.object({
  oldPassword: z
    .string()
    .trim()
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
  confirmPassword: z.string().min(1, "confirm password is required"),
  flag: z.enum(Object.values(LOGOUT_ENUM)).default(LOGOUT_ENUM.STAY_LOGGED_IN),
});

export type UpdatePasswordFields = z.infer<typeof updatePasswordSchema>;
