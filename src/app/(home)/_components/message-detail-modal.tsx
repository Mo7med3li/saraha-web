"use client";

import Image from "next/image";
import { useForm } from "@tanstack/react-form";
import { ImageIcon, Loader2, MessageCircleReply, Send } from "lucide-react";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Modal } from "@/src/components/shared/modal";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { MessageAttachmentsField } from "@/src/app/u/[id]/_components/message-attachments-field";
import {
  sendMessageSchema,
  type SendMessageFields,
} from "@/src/app/u/[id]/_schema/send-message.schema";
import { useMutationReplyMessage } from "../_hooks/use-mutation-reply-message";

function formatMessageDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function canReplyToMessage(message: IMessage) {
  return Boolean(message.senderId);
}

type MessageDetailModalProps = {
  message: IMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MessageDetailModal({
  message,
  open,
  onOpenChange,
}: MessageDetailModalProps) {
  const { replyMessage, isPending } = useMutationReplyMessage();
  const replyable = message ? canReplyToMessage(message) : false;

  const form = useForm({
    defaultValues: {
      content: "",
      attachments: [] as File[],
    } satisfies SendMessageFields,
    validators: {
      onChange: sendMessageSchema,
      onSubmit: sendMessageSchema,
    },
    onSubmit: async ({ value }) => {
      if (!message || !replyable) return;

      const formData = new FormData();
      const content = value.content.trim();
      if (content.length >= 3) {
        formData.append("content", content);
      }
      value.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await replyMessage({ messageId: message._id, formData });
      form.reset();
      onOpenChange(false);
    },
  });

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) form.reset();
        onOpenChange(next);
      }}
      title="Message"
      description={
        message
          ? formatMessageDate(message.createdAt)
          : undefined
      }
      width={560}
      className="sm:max-w-xl"
    >
      {message ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[oklch(0.42_0.04_200)]">
              {replyable
                ? message.sender?.userName
                  ? `From ${message.sender.userName}`
                  : "From a Saraha user"
                : "Anonymous"}
            </p>

            {message.content ? (
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
                {message.content}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Photo message
              </p>
            )}

            {message.attachments?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {message.attachments.map((file) => (
                  <a
                    key={file._id || file.asset_id}
                    href={file.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block size-20 overflow-hidden rounded-xl bg-muted sm:size-24"
                  >
                    <Image
                      width={120}
                      height={120}
                      src={file.imageUrl}
                      alt=""
                      className="size-full object-cover transition group-hover:scale-[1.03]"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
                      <ImageIcon className="size-4 text-white" />
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {replyable ? (
            <div className="space-y-3 border-t border-border/50 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MessageCircleReply className="size-4 text-[oklch(0.35_0.05_200)]" />
                Reply
              </div>

              <TanStackFormProvider form={form}>
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void form.handleSubmit();
                  }}
                >
                  <TanStackFormItem
                    name="content"
                    label="Your reply"
                    labelProps={{ className: "hidden" }}
                    inputProps={{ className: "col-span-12" }}
                  >
                    {(field) => (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value as string}
                        disabled={isPending}
                        placeholder="Write a reply…"
                        className="min-h-24 resize-none rounded-xl"
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={
                          field.state.meta.isTouched && !field.state.meta.isValid
                        }
                      />
                    )}
                  </TanStackFormItem>

                  <TanStackFormItem
                    name="attachments"
                    label="Attachments"
                    labelProps={{ className: "hidden" }}
                    inputProps={{ className: "col-span-12" }}
                  >
                    {(field) => (
                      <MessageAttachmentsField
                        field={field}
                        disabled={isPending}
                      />
                    )}
                  </TanStackFormItem>

                  <form.Subscribe
                    selector={(state) => ({
                      canSubmit: state.canSubmit,
                      isSubmitting: state.isSubmitting,
                    })}
                  >
                    {({ canSubmit, isSubmitting }) => (
                      <Button
                        type="submit"
                        disabled={isPending || isSubmitting || !canSubmit}
                        className="h-10 w-full rounded-xl bg-[oklch(0.28_0.05_200)] text-white hover:bg-[oklch(0.24_0.05_200)]"
                      >
                        {isPending || isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="size-4" />
                            Send reply
                          </>
                        )}
                      </Button>
                    )}
                  </form.Subscribe>
                </form>
              </TanStackFormProvider>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
              This sender stayed anonymous, so you can’t reply.
            </p>
          )}
        </div>
      ) : null}
    </Modal>
  );
}

export { canReplyToMessage };
