import z from "zod";

export const sendOtpSchema = z.object({
  email: z.email({
    message: "Email is invalid",
  }),
});

export type SendOtpFields = z.infer<typeof sendOtpSchema>;
