"use client";

import { useMutation } from "@tanstack/react-query";
import { replyMessageAction } from "../_actions/reply-message.action";

type ReplyMessageInput = {
  messageId: string;
  formData: FormData;
};

export function useMutationReplyMessage() {
  const { mutateAsync: replyMessage, isPending } = useMutation({
    mutationFn: async ({ messageId, formData }: ReplyMessageInput) =>
      await replyMessageAction(messageId, formData),
    meta: {
      loadingMessage: "Sending reply…",
      successMessage: "Reply sent",
      errorMessage: "Failed to send reply",
    },
  });

  return { replyMessage, isPending };
}
