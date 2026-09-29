"use client";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useEffect, useState } from "react";
import { useMutationConfirmEmail } from "../_hooks/use-mutation-confirm-email";
import { confirmEmailSchema } from "../_schema/confirm-email.schema";
import { useRouter } from "next/navigation";
import { useMutationResendEmail } from "../_hooks/use-mutation-resend-email";
import { useRegisterEmailContext } from "@/src/components/providers/components/register-email.provider";
interface ConfirmationStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
export default function ConfirmationStep({ setStep }: ConfirmationStepProps) {
  // states
  const [seconds, setSeconds] = useState(0);

  //   navigation
  const router = useRouter();

  // context
  const { email } = useRegisterEmailContext();

  // effects
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  // hooks
  const { confirmEmailMutation, isPending } = useMutationConfirmEmail();
  const { resendEmailMutation, isPending: resendPending } =
    useMutationResendEmail();

  // functions

  //   form
  const form = useForm({
    defaultValues: {
      email,
      otp: "",
    },
    validators: {
      onSubmit: confirmEmailSchema,
      onChange: confirmEmailSchema,
      onMount: confirmEmailSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await confirmEmailMutation(value);
        setStep(1);
        router.push("/login");
      } catch (error) {
        console.error(error);
      }
    },
  });
  //   functions
  const handleClick = async () => {
    try {
      await resendEmailMutation({
        email: form.state.values.email,
      });
      setSeconds(120);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[oklch(0.28_0.05_200/0.08)] ring-1 ring-[oklch(0.28_0.05_200/0.2)]">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[oklch(0.28_0.05_200)]"
          >
            <path
              d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Check your inbox
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            We sent a 6-digit code to your email address.
          </p>
        </div>
      </div>

      <TanStackFormProvider form={form}>
        <div className="space-y-4">
          {email}
          <TanStackFormItem name="otp" label="Verification code" required>
            {(field) => (
              <InputOTP
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                maxLength={6}
                value={field.state.value}
                onChange={(val) => field.handleChange(val)}
              >
                <InputOTPGroup className="flex justify-between w-full gap-2">
                  <InputOTPSlot
                    index={0}
                    className="w-full h-12 text-lg"
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  <InputOTPSlot index={1} className="w-full h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-full h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-full h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-full h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-full h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            )}
          </TanStackFormItem>
        </div>

        {/* ── Actions ── */}
        <div className="mt-6 space-y-3">
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
                disabled={isPending || !isValid || !canSubmit || !isDirty}
                className="w-full"
                onClick={form.handleSubmit}
              >
                {isPending ? "Verifying…" : "Confirm email"}
              </Button>
            )}
          </form.Subscribe>

          <div className="flex items-center justify-center gap-1.5">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive it?
            </p>
            <Button
              disabled={seconds > 0 || resendPending}
              variant="link"
              className="h-auto p-0 text-xs font-medium"
              onClick={handleClick}
            >
              {seconds > 0 || resendPending ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Resend in {seconds}s
                </span>
              ) : (
                "Resend code"
              )}
            </Button>
          </div>
        </div>
      </TanStackFormProvider>
    </section>
  );
}
