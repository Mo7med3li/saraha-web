import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { GalleryModalDisplay } from "@/src/components/shared/gallery-modal-display";
import { Button } from "@/src/components/ui/button";
import { Images, Loader2, Sparkles } from "lucide-react";
import { useMutationUpdateGallery } from "../_hooks/use-mutation-update-avatar copy";
import { useForm, useSelector } from "@tanstack/react-form";
import { updateGallerySchema } from "../_schemas/gallery.schema";
import { ExistingImageItem, NewImageItem } from "@/src/lib/types/gallery";

type GalleryItem = NewImageItem | ExistingImageItem;

function isNewImage(item: GalleryItem): item is NewImageItem {
  return "media" in item && item.media?.file instanceof File;
}
export const UserGallery = ({ user }: { user: IUser }) => {
  // hooks
  const { updateGalleryMutation, isPending } = useMutationUpdateGallery();

  //   form
  const form = useForm({
    defaultValues: {
      images: user.profileGallery || [],
    },
    validators: {
      onChange: updateGallerySchema,
      onMount: updateGallerySchema,
      onSubmit: updateGallerySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        if (value.images.length > 0) {
          const newImages = value.images.filter(
            isNewImage,
          ) as unknown as NewImageItem[];
          const existingImages = value.images.filter(
            (item) => !isNewImage(item),
          ) as unknown as ExistingImageItem[];

          newImages.forEach((item) => {
            formData.append("profileGallery", item.media.file);
          });

          existingImages.forEach((item) => {
            formData.append("existingImages", item.imageUrl);
          });
        }
        await updateGalleryMutation(formData);
      } catch (error) {
        console.error("Error updating gallery:", error);
        form.reset();
      }
    },
  });

  const isDirty = useSelector(form.store, (state) => state.isDirty);

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-5 border-b border-border/50">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Images className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Profile Gallery
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Upload photos & videos for your profile. Drag thumbnails to
              reorder sequence.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <TanStackFormProvider form={form}>
          <TanStackFormItem
            inputProps={{ className: "w-full lg:col-span-12" }}
            labelProps={{ className: "hidden" }}
            name="images"
          >
            {(field) => (
              <GalleryModalDisplay
                key={field.state.value
                  .map((item: GalleryItem) => item.id)
                  .join(",")}
                value={field.state.value}
                onChange={(images) => field.handleChange(images)}
              />
            )}
          </TanStackFormItem>

          <div className="flex justify-end pt-2 gap-2">
            <form.Subscribe
              selector={(state) => ({
                isValid: state.isValid,
                canSubmit: state.canSubmit,
                isDirty: state.isDirty,
              })}
            >
              {({ isValid, canSubmit, isDirty }) => (
                <Button
                  type="button"
                  onClick={() => form.handleSubmit()}
                  disabled={isPending || !isValid || !canSubmit || !isDirty}
                  className="rounded-xl px-6 font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Gallery…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Save Gallery Changes
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>

            {isDirty && (
              <Button
                type="button"
                onClick={() => {
                  form.reset();
                }}
                variant="outline"
                className="rounded-xl px-6 font-semibold cursor-pointer border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              >
                Cancel Changes
              </Button>
            )}
          </div>
        </TanStackFormProvider>
      </div>
    </div>
  );
};
