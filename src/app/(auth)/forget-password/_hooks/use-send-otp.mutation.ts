import { useMutation } from "@tanstack/react-query";
import { SendOtpFields } from "../_schema/send-otp.schema";
import { sendOtpAction } from "../_actions/send-otp.action";

export const useMutationSendOtp = () => {
  const { mutateAsync: sendOtpMutation, isPending } = useMutation({
    mutationFn: async (data: SendOtpFields) => await sendOtpAction(data),
    meta: {
      loadingMessage: "Sending OTP....",
      errorMessage: "Fail to send OTP",
      successMessage: "OTP sent successfully",
    },
  });
  return { sendOtpMutation, isPending };
};
