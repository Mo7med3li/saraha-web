"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Loader2, Send, UserRound } from "lucide-react";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { useMutationSendMessage } from "../_hooks/use-mutation-send-message";
import {
  sendMessageSchema,
  type SendMessageFields,
} from "../_schema/send-message.schema";
import { MessageAttachmentsField } from "./message-attachments-field";

type SendMessageFormProps = {
  receiverId: string;
  receiverName: string;
  signupHref: string;
  loginHref: string;
  isAuthenticated: boolean;
  senderName?: string;
};

export default function SendMessageForm({
  receiverId,
  receiverName,
  signupHref,
  loginHref,
  isAuthenticated,
  senderName,
}: SendMessageFormProps) {
  const { sendMessage, isPending } = useMutationSendMessage();
  // Logged-in users default to identified (non-anonymous) send.
  const [sendAsYourself, setSendAsYourself] = useState(isAuthenticated);

  const identified = isAuthenticated && sendAsYourself;
  const firstName = receiverName.split(" ")[0] || "them";

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
      const formData = new FormData();
      const content = value.content.trim();

      if (content.length >= 3) {
        formData.append("content", content);
      }

      value.attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await sendMessage({ receiverId, formData, identified });
      form.reset();
    },
  });

  return (
    <TanStackFormProvider form={form}>
      <form
        className="auth-rise-delayed flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-2">
          {isAuthenticated ? (
            <div
              role="group"
              aria-label="How to send"
              className="flex gap-1 rounded-xl border border-border/60 bg-muted/40 p-1"
            >
              <button
                type="button"
                disabled={isPending}
                onClick={() => setSendAsYourself(true)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  sendAsYourself
                    ? "bg-[oklch(0.28_0.05_200)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserRound className="size-3.5" />
                As {senderName?.split(" ")[0] || "you"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setSendAsYourself(false)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  !sendAsYourself
                    ? "bg-[oklch(0.28_0.05_200)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anonymous
              </button>
            </div>
          ) : null}

          <TanStackFormItem
            name="content"
            label={identified ? "Your message" : "Your anonymous message"}
            labelProps={{ className: "hidden" }}
            inputProps={{ className: "col-span-12" }}
          >
            {(field) => (
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                disabled={isPending}
                placeholder={
                  identified
                    ? `Say something to ${firstName}…`
                    : `Say something honest to ${firstName}…`
                }
                className="min-h-[8.5rem] flex-1 resize-none rounded-none border-0 border-b border-border/70 bg-transparent px-0 py-2 text-lg leading-relaxed shadow-none focus-visible:border-[oklch(0.45_0.06_200)] focus-visible:ring-0 sm:min-h-[12rem] sm:text-xl"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
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
              <MessageAttachmentsField field={field} disabled={isPending} />
            )}
          </TanStackFormItem>
        </div>

        <div className="shrink-0 space-y-3 border-t border-border/40 pt-4">
          <p className="text-center text-xs text-muted-foreground">
            {identified
              ? `${firstName} will see your name and can reply.`
              : `${firstName} won’t see who you are.`}
          </p>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <Button
                type="submit"
                size="lg"
                disabled={isPending || isSubmitting || !canSubmit}
                className="h-12 w-full rounded-2xl bg-[oklch(0.28_0.05_200)] text-base text-white hover:bg-[oklch(0.24_0.05_200)]"
              >
                {isPending || isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {identified ? "Send as yourself" : "Send anonymously"}
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>

          {!isAuthenticated ? (
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Want to send with your name so they can reply?{" "}
              <Link
                href={loginHref}
                className="font-medium text-[oklch(0.28_0.05_200)] underline-offset-2 hover:underline"
              >
                Log in
              </Link>
              {" · "}
              <Link
                href={signupHref}
                className="font-medium text-[oklch(0.28_0.05_200)] underline-offset-2 hover:underline"
              >
                Sign up
              </Link>
            </p>
          ) : null}
        </div>
      </form>
    </TanStackFormProvider>
  );
}
