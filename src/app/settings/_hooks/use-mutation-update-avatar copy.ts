import { QueryKey, useMutation } from "@tanstack/react-query";
import { updateUserGalleryAction } from "../_actions/user-gallery.action";

export const useMutationUpdateGallery = () => {
  const { mutateAsync: updateGalleryMutation, isPending } = useMutation({
    mutationFn: (data: FormData) => updateUserGalleryAction(data),
    meta: {
      loadingMessage: "Updating gallery...",
      successMessage: "Gallery updated successfully!",
      errorMessage: "Failed to update gallery",
      invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
    },
  });
  return {
    updateGalleryMutation,
    isPending,
  };
};
