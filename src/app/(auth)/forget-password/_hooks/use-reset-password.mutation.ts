import { useMutation } from "@tanstack/react-query";
import { ResetPasswordFields } from "../_schema/reset-password.schema";
import { resetPasswordAction } from "../_actions/reset-password.action";

export const useMutationResetPassword = () => {
  const { mutateAsync: resetPasswordMutation, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordFields) =>
      await resetPasswordAction(data),
    meta: {
      loadingMessage: "Resetting your password....",
      errorMessage: "Fail to reset your password",
      successMessage: "Your password reset successfully",
    },
  });
  return { resetPasswordMutation, isPending };
};
