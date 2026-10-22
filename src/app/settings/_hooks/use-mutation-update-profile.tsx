import { QueryKey, useMutation } from "@tanstack/react-query";
import { updateUserAction } from "../_actions/update-user.action";
import { UpdateProfileFields } from "../_schemas/update-profile.schema";

export const useMutationUpdateProfile = () => {
  const { mutateAsync: updateProfileMutation, isPending } = useMutation({
    mutationFn: (data: UpdateProfileFields) => updateUserAction(data),
    meta: {
      loadingMessage: "Updating profile...",
      successMessage: "Profile updated successfully!",
      errorMessage: "Failed to update profile",
      invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
    },
  });
  return {
    updateProfileMutation,
    isPending,
  };
};
