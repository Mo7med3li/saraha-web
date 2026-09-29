import { useMutation } from "@tanstack/react-query";
import { VerifyOtpFields } from "../_schema/verify-otp.schema";
import { verifyOtpAction } from "../_actions/verify-otp.action";

export const useMutationVerifyOtp = () => {
  const { mutateAsync: verifyOtpMutation, isPending } = useMutation({
    mutationFn: async (data: VerifyOtpFields) => await verifyOtpAction(data),
    meta: {
      loadingMessage: "Verifying OTP....",
      errorMessage: "Fail to verify OTP",
      successMessage: "OTP verified successfully",
    },
  });
  return { verifyOtpMutation, isPending };
};
