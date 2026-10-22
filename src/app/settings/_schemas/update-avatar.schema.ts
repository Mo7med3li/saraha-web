import { z } from "zod";

export const updateAvatarSchema = z.object({
  image: z.any().refine((val) => Boolean(val), {
    message: "Image is required",
  }),
});

