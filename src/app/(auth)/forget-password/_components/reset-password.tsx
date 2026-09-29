"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useRegisterEmailContext } from "@/src/components/providers/components/register-email.provider";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useMutationResetPassword } from "../_hooks/use-reset-password.mutation";
import { resetPasswordSchema } from "../_schema/reset-password.schema";

interface ResetPasswordProps {
  onStepChange: (step: "send-otp" | "verify-otp" | "reset-password") => void;
}

export default function ResetPassword({ onStepChange }: ResetPasswordProps) {
  // context
  const { email } = useRegisterEmailContext();

  //   navigation
  const router = useRouter();

  // mutations
  const { resetPasswordMutation, isPending } = useMutationResetPassword();

  //   form
  const form = useForm({
    defaultValues: {
      email: email || "",
      otp: localStorage.getItem("otp") || "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
      onMount: resetPasswordSchema,
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await resetPasswordMutation({
          ...value,
          email: email || value.email,
          otp: localStorage.getItem("otp") || "",
        });
        localStorage.removeItem("otp");
        onStepChange("send-otp");
        router.push("/login");
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Failed to reset password",
        );
      }
    },
  });

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Create a new strong password for your account. It must contain at least
        8 characters with uppercase, lowercase, number, and special character.
      </p>

      {/* form */}
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
            name="password"
            label="New password"
            labelProps={{
              className: "col-span-12 mb-1 font-medium text-xs text-foreground",
            }}
            inputProps={{ className: "col-span-12" }}
          >
            {(field) => (
              <Input
                type="password"
                placeholder="Enter new password"
                heightClassName="h-10"
                autoComplete="new-password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
            )}
          </TanStackFormItem>

          <TanStackFormItem
            required
            name="confirmPassword"
            label="Confirm new password"
            labelProps={{
              className: "col-span-12 mb-1 font-medium text-xs text-foreground",
            }}
            inputProps={{ className: "col-span-12" }}
          >
            {(field) => (
              <Input
                type="password"
                placeholder="Repeat new password"
                heightClassName="h-10"
                autoComplete="new-password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
            )}
          </TanStackFormItem>

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
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </TanStackFormProvider>
    </div>
  );
}
