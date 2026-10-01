import { QueryKey, useMutation } from "@tanstack/react-query";
import { updateUserAvatarAction } from "../_actions/update-user-avatar.action";

export const useMutationUpdateAvatar = () => {
  const { mutateAsync: updateAvatarMutation, isPending } = useMutation({
    mutationFn: (data: FormData) => updateUserAvatarAction(data),
    meta: {
      loadingMessage: "Updating avatar...",
      successMessage: "Avatar updated successfully!",
      errorMessage: "Failed to update avatar",
      invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
    },
  });
  return {
    updateAvatarMutation,
    isPending,
  };
};
