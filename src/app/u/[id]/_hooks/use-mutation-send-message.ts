import { useMutation } from "@tanstack/react-query";
import { sendMessageAction } from "../_actions/send-message.action";

type SendMessageInput = {
  receiverId: string;
  formData: FormData;
  identified?: boolean;
};

export const useMutationSendMessage = () => {
  const { mutateAsync: sendMessage, isPending } = useMutation({
    mutationFn: async ({
      receiverId,
      formData,
      identified = false,
    }: SendMessageInput) =>
      await sendMessageAction(receiverId, formData, { identified }),
    meta: {
      loadingMessage: "Sending your message…",
      successMessage: "Message sent",
      errorMessage: "Failed to send message",
    },
  });

  return { sendMessage, isPending };
};
