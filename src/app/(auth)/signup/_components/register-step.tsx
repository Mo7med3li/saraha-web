"use client";
import { useRegisterEmailContext } from "@/src/components/providers/components/register-email.provider";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { PhoneInput } from "@/src/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useMutationSignup } from "../_hooks/use-mutation-signup";
import { signupSchema } from "../_schema/signup.schema";
interface RegisterStepProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
export default function RegisterStep({ setStep }: RegisterStepProps) {
  // hooks
  const { signup, isPending } = useMutationSignup();
  // context
  const { setEmail } = useRegisterEmailContext();

  //   form
  const form = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      gender: "",
    },
    validators: {
      onSubmit: signupSchema,
      onChange: signupSchema,
      onMount: signupSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signup(value);
        setEmail(value.email);
        setStep(2);
      } catch (error) {
        if (
          (error as Error).message ===
          "User created but failed to send confirmation email. Please resend OTP."
        ) {
          setEmail(value.email);
          setStep(2);
          toast.warning(
            "Account created! We couldn't send the confirmation email right now. sign up with Google instead.",
            { duration: 8000 },
          );
        } else {
          console.error(error);
        }
      }
    },
  });
  return (
    <section>
      <TanStackFormProvider form={form}>
        <div className="space-y-5">
          {/* ── Identity ── */}
          <TanStackFormItem required name="userName" label="Username">
            {(field) => (
              <Input
                placeholder="e.g. mohamed ali"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
            )}
          </TanStackFormItem>

          <TanStackFormItem required name="email" label="Email">
            {(field) => (
              <Input
                type="email"
                placeholder="you@gmail.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
            )}
          </TanStackFormItem>
          <TanStackFormItem required name="password" label="Password">
            {(field) => (
              <Input
                type="password"
                placeholder="Min 8 characters"
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
            label="Confirm Password"
          >
            {(field) => (
              <Input
                type="password"
                placeholder="Repeat password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              />
            )}
          </TanStackFormItem>
          <TanStackFormItem required name="phoneNumber" label="Phone Number">
            {(field) => (
              <PhoneInput
                onChange={(val) => field.handleChange(val)}
                value={field.state.value}
                name={field.name}
                defaultCountry="EG"
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                placeholder="Phone number"
              />
            )}
          </TanStackFormItem>

          <TanStackFormItem required name="gender" label="Gender">
            {(field) => (
              <RadioGroup
                value={field.state.value}
                onValueChange={field.handleChange}
                aria-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                className="flex gap-6 pt-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            )}
          </TanStackFormItem>
        </div>
        {/* ── Submit ── */}
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
                onClick={() => {
                  // form.handleSubmit();
                  toast.warning(
                    "Sign up with Google instead for instant access.",
                    { duration: 8000 },
                  );
                }}
              >
                {isPending ? "Creating account…" : "Continue"}
              </Button>
            )}
          </form.Subscribe>
          <p className="text-center text-xs text-muted-foreground">
            You&apos;ll verify your email in the next step.
          </p>
        </div>
      </TanStackFormProvider>
    </section>
  );
}
