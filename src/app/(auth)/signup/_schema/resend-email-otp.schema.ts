import z from "zod";

export const resendEmailSchema = z.object({
  email: z
    .email({
      message: "email is invalid",
    })
    .min(1, { message: "email is required" }),
});

export type ResendEmailFields = z.infer<typeof resendEmailSchema>;
