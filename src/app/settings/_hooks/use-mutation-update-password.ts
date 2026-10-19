import { QueryKey, useMutation } from "@tanstack/react-query";
import { updateUserPasswordAction } from "../_actions/update-user-password.action";
import { UpdatePasswordFields } from "../_schemas/update-password.schema";

export const useMutationUpdatePassword = () => {
  const { mutateAsync: updatePasswordMutation, isPending } = useMutation({
    mutationFn: (data: UpdatePasswordFields) => updateUserPasswordAction(data),
    meta: {
      loadingMessage: "Updating password...",
      successMessage: "Password updated successfully!",
      errorMessage: "Failed to update password",
      invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
    },
  });
  return {
    updatePasswordMutation,
    isPending,
  };
};
