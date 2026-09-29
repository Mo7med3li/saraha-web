"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import { verifyOtpSchema } from "../_schema/verify-otp.schema";
import { useMutationVerifyOtp } from "../_hooks/use-verify-otp.mutation";
import { useMutationSendOtp } from "../_hooks/use-send-otp.mutation";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { useRegisterEmailContext } from "@/src/components/providers/components/register-email.provider";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";

interface VerifyOtpProps {
  onStepChange: (step: "send-otp" | "verify-otp" | "reset-password") => void;
}

export default function VerifyOtp({ onStepChange }: VerifyOtpProps) {
  // context
  const { email } = useRegisterEmailContext();
  const [seconds, setSeconds] = useState(60);

  // mutations
  const { verifyOtpMutation, isPending } = useMutationVerifyOtp();
  const { sendOtpMutation, isPending: isResending } = useMutationSendOtp();

  //   effect
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please go back and enter your email.");
      onStepChange("send-otp");
      return;
    }
    try {
      await sendOtpMutation({ email });
      setSeconds(60);
    } catch (error) {
      console.error(error);
    }
  };

  //   form
  const form = useForm({
    defaultValues: {
      email: email || "",
      otp: "",
    },
    validators: {
      onChange: verifyOtpSchema,
      onMount: verifyOtpSchema,
      onSubmit: verifyOtpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await verifyOtpMutation(value);
        localStorage.setItem("otp", value.otp);

        onStepChange("reset-password");
      } catch (error) {
        console.error(
          error instanceof Error ? error?.message : "Failed to send OTP",
        );
      }
    },
  });

  return (
    <div className="space-y-4">
      {/* header message */}
      <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
        We sent a 6-digit verification code to{" "}
        <span className="font-semibold text-foreground">
          {email || "your email"}
        </span>
        .
      </div>

      {/* form */}
      <TanStackFormProvider form={form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <TanStackFormItem
            name="otp"
            label="Verification code"
            required
            labelProps={{
              className:
                "col-span-12 mb-1.5 font-medium text-xs text-foreground",
            }}
            inputProps={{ className: "col-span-12" }}
          >
            {(field) => (
              <InputOTP
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                maxLength={6}
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
              >
                <InputOTPGroup className="flex justify-between w-full gap-1.5 sm:gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-full h-11 text-base sm:text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-full h-11 text-base sm:text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-full h-11 text-base sm:text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-full h-11 text-base sm:text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={4}
                    className="w-full h-11 text-base sm:text-lg font-semibold"
                  />
                  <InputOTPSlot
                    index={5}
                    className="w-full h-11 text-base sm:text-lg font-semibold"
                  />
                </InputOTPGroup>
              </InputOTP>
            )}
          </TanStackFormItem>

          {/* submit button */}
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
                    Verifying code...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </TanStackFormProvider>

      {/* resend and back buttons */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          type="button"
          onClick={() => onStepChange("send-otp")}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Change email
        </button>

        <Button
          type="button"
          disabled={seconds > 0 || isResending}
          variant="link"
          className="h-auto p-0 text-xs font-medium text-primary"
          onClick={handleResend}
        >
          {isResending ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Resending...
            </span>
          ) : seconds > 0 ? (
            <span className="text-muted-foreground">
              Resend code in {seconds}s
            </span>
          ) : (
            "Resend code"
          )}
        </Button>
      </div>
    </div>
  );
}
