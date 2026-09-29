import { useMutation } from "@tanstack/react-query";
import { ConfirmEmailFields } from "../_schema/confirm-email.schema";
import { confirmEmailAction } from "../_actions/confirm-email.action";

export const useMutationConfirmEmail = () => {
  const { mutateAsync: confirmEmailMutation, isPending } = useMutation({
    mutationFn: async (data: ConfirmEmailFields) =>
      await confirmEmailAction(data),
    meta: {
      loadingMessage: "Confirming your email....",
      errorMessage: "Fail to confirm your email",
      successMessage: "Your email confirmed successfully",
    },
  });
  return { confirmEmailMutation, isPending };
};
