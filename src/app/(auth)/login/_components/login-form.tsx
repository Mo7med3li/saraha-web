"use client";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const zodSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: zodSchema,
      onMount: zodSchema,
      onSubmit: zodSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await signIn("credentials", {
        email: value.email,
        password: value.password,
        redirect: false,
      });
      if (result?.ok) {
        toast.success("Login successful");
        const callbackUrl =
          new URLSearchParams(window.location.search).get("callbackUrl") ||
          "/dashboard";
        window.location.href = callbackUrl;
      } else {
        console.log(result);

        setError(result?.error as string);
        toast.error("Login failed");
      }
    },
  });
  return (
    <div className="flex flex-col gap-3">
      <TanStackFormProvider form={form}>
        <TanStackFormItem required name="email" label="Email">
          {(field) => (
            <Input
              placeholder="Enter your email"
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </TanStackFormItem>
        <TanStackFormItem required name="password" label="Password">
          {(field) => (
            <Input
              type="password"
              placeholder="Enter your password"
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              }
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </TanStackFormItem>
      </TanStackFormProvider>
      <form.Subscribe
        selector={(state) => ({
          isValid: state.isValid,
          canSubmit: state.canSubmit,
          isDirty: state.isDirty,
        })}
      >
        {({ isValid, canSubmit, isDirty }) => (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              form.handleSubmit();
            }}
            disabled={!isValid || !canSubmit || !isDirty}
          >
            Login
          </Button>
        )}
      </form.Subscribe>
      {error && <p className="text-red-500">{error}</p>}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          try {
            const callbackUrl =
              new URLSearchParams(window.location.search).get("callbackUrl") ||
              "/dashboard";
            void signIn("google", { callbackUrl });
          } catch (error) {
            console.error(error);
            toast.error(
              "Failed to login with Google" + (error as Error).message,
            );
            setError("Failed to login with Google" + (error as Error).message);
          }
        }}
      >
        Login with Google
      </Button>
    </div>
  );
}
