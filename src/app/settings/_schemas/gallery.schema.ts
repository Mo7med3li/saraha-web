import { z } from "zod";

export const updateGallerySchema = z.object({
  images: z.array(z.any()).refine((val) => Boolean(val), {
    message: "Image is required",
  }),
});
