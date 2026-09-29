"use client";

import { useForm } from "@tanstack/react-form";
import { sendOtpSchema } from "../_schema/send-otp.schema";
import { useMutationSendOtp } from "../_hooks/use-send-otp.mutation";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useRegisterEmailContext } from "@/src/components/providers/components/register-email.provider";
import { Loader2 } from "lucide-react";

interface SendOtpProps {
  onStepChange: (step: "send-otp" | "verify-otp" | "reset-password") => void;
}

export default function SendOtp({ onStepChange }: SendOtpProps) {
  // context
  const { setEmail } = useRegisterEmailContext();
  const { sendOtpMutation, isPending } = useMutationSendOtp();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: sendOtpSchema,
      onMount: sendOtpSchema,
      onSubmit: sendOtpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await sendOtpMutation(value);
        setEmail(value.email);

        onStepChange("verify-otp");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Enter the email address associated with your account and we&apos;ll send
        you a 6-digit verification code.
      </p>

      <TanStackFormProvider form={form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <TanStackFormItem
            required
            name="email"
            label="Email address"
            labelProps={{
              className: "col-span-12 mb-1 font-medium text-xs text-foreground",
            }}
            inputProps={{ className: "col-span-12" }}
          >
            {(field) => (
              <Input
                type="email"
                placeholder="you@example.com"
                heightClassName="h-10"
                autoComplete="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched
                }
              />
            )}
          </TanStackFormItem>

          {/* ── Submit Button ── */}
          <form.Subscribe
            selector={(state) => ({
              isValid: state.isValid,
              canSubmit: state.canSubmit,
              isDirty: state.isDirty,
            })}
          >
            {({ isValid, canSubmit, isDirty }) => (
              <Button
                type="submit"
                className="w-full h-10 font-medium transition-all shadow-sm"
                disabled={isPending || !isValid || !canSubmit || !isDirty}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </TanStackFormProvider>
    </div>
  );
}
