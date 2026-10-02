import { TanStackFormProvider } from "@/src/components/shared/form-item";
import { ImageUploader } from "@/src/components/shared/image-uploader";
import { Button } from "@/src/components/ui/button";
import { useForm, useSelector } from "@tanstack/react-form";
import { CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import { useMutationUpdateAvatar } from "../_hooks/use-mutation-update-avatar";
import { updateAvatarSchema } from "../_schemas/update-avatar.schema";

export default function ProfileAvatarSection({ user }: { user: IUser }) {
  // hooks
  const { updateAvatarMutation, isPending } = useMutationUpdateAvatar();

  //   form
  const form = useForm({
    defaultValues: {
      image: user?.profileImage?.imageUrl || (null as string | File | null),
    },
    validators: {
      onChange: updateAvatarSchema,
      onMount: updateAvatarSchema,
      onSubmit: updateAvatarSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        if (value.image instanceof File) {
          formData.append("profileImage", value.image);
          await updateAvatarMutation(formData);
        }
      } catch (error) {
        console.error("Error updating avatar:", error);
        form.reset();
      }
    },
  });

  const isDirty = useSelector(form.store, (state) => state.isDirty);

  return (
    <section className="w-full h-full space-y-8">
      <TanStackFormProvider form={form}>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-border/50">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <ImageIcon className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Profile Avatar
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Upload and crop a high resolution profile picture.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUploader
              name="image"
              label="Avatar Picture"
              cropShape="round"
              aspect={1}
              classNames="w-[500px]"
              defaultValue={user?.profileImage?.imageUrl}
              uploadTitle="Choose Profile Picture"
            />

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
                    onClick={() => {
                      form.handleSubmit();
                    }}
                    disabled={isPending || !isValid || !canSubmit || !isDirty}
                    variant="outline"
                    className="rounded-xl px-6 font-semibold cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-500" />
                        Updating Picture…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-purple-500" />
                        Update Profile Picture
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
                  className="rounded-xl px-6 font-semibold cursor-pointer border-purple-500/30 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                >
                  Cancel Changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </TanStackFormProvider>
    </section>
  );
}
