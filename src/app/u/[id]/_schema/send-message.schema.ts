import { z } from "zod";

const MAX_ATTACHMENTS = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const attachmentSchema = z
  .custom<File>((value) => value instanceof File, {
    message: "Invalid file",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Each image must be 5MB or smaller",
  })
  .refine((file) => ACCEPTED_TYPES.includes(file.type), {
    message: "Only JPG, PNG, or WebP images are allowed",
  });

export const sendMessageSchema = z
  .object({
    content: z
      .string()
      .trim()
      .max(20000, { message: "Message must be less than 20000 characters" }),
    attachments: z
      .array(attachmentSchema)
      .max(MAX_ATTACHMENTS, { message: "You can attach up to 2 images" }),
  })
  .superRefine((data, ctx) => {
    const hasContent = data.content.length >= 3;
    const hasAttachments = data.attachments.length > 0;

    if (!hasContent && !hasAttachments) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "Write at least 3 characters or attach an image",
      });
    }

    if (data.content.length > 0 && data.content.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "Message must be at least 3 characters",
      });
    }
  });

export type SendMessageFields = z.infer<typeof sendMessageSchema>;

export const MESSAGE_ATTACHMENT_LIMITS = {
  maxFiles: MAX_ATTACHMENTS,
  maxFileSize: MAX_FILE_SIZE,
  acceptedTypes: ACCEPTED_TYPES,
} as const;
