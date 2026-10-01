import { GENDER_ENUM } from "@/src/lib/constants/api.constant";
import z from "zod";

export const updateProfileSchema = z.object({
  userName: z
    .string()
    .trim()
    .max(20, {
      message: "Username must be at most 20 characters",
    })
    .regex(/^[a-zA-Z]+ [a-zA-Z]+$/, {
      message: "Username must be first and last name separated by one space",
    })
    // .optional()
    .or(z.literal("")),

  phoneNumber: z
    .string()
    .regex(/^\+201[0125]\d{8}$/, {
      message: "Enter a valid Egyptian phone number",
    })
    // .optional()
    .or(z.literal("")),

  gender: z.enum([...Object.values(GENDER_ENUM)]),
});

export type UpdateProfileFields = z.infer<typeof updateProfileSchema>;
