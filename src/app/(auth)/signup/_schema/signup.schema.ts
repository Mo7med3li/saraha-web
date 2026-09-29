import { GENDER_ENUM } from "@/src/lib/constants/api.constant";
import z from "zod";

export const signupSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(1, { message: "Username is required" })
      .max(20, { message: "Username must be at most 20 characters" })
      .regex(/^[a-zA-Z]+ [a-zA-Z]+$/, {
        message:
          "Username must be first and last name separated by one space (3-20 letters each)",
      }),
    email: z.string().min(1, { message: "email is required" }).email({
      message: "email is invalid",
    }),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+201[0125]\d{8}$/, {
        message: "Enter a valid Egyptian phone number",
      }),

    gender: z.enum([...Object.values(GENDER_ENUM)], {
      message: "gender must be on of male or female",
    }),
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

export type RegistrationFields = z.infer<typeof signupSchema>;
