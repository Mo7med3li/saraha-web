import { useMutation } from "@tanstack/react-query";
import { resendEmailAction } from "../_actions/resend-email-otp.action";
import { ResendEmailFields } from "../_schema/resend-email-otp.schema";

export const useMutationResendEmail = () => {
  const { mutateAsync: resendEmailMutation, isPending } = useMutation({
    mutationFn: async (data: ResendEmailFields) =>
      await resendEmailAction(data),
    meta: {
      loadingMessage: "Resending your email....",
      errorMessage: "Fail to resend your email",
      successMessage: "OTP sent to your email successfully",
    },
  });
  return { resendEmailMutation, isPending };
};
