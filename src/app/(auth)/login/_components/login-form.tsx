"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { GoogleIcon } from "@/src/components/icons";
import { loginSchema } from "../_schema/login.schema";

export default function LoginForm() {
  // state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
      onMount: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      setIsLoading(true);
      try {
        const result = await signIn("credentials", {
          email: value.email,
          password: value.password,
          redirect: false,
        });

        if (result?.ok) {
          toast.success("Welcome back! Redirecting...");
          const callbackUrl =
            new URLSearchParams(window.location.search).get("callbackUrl") ||
            "/dashboard";
          window.location.href = callbackUrl;
        } else {
          const errorMessage =
            result?.error || "Invalid email or password. Please try again.";
          setError(errorMessage);
          toast.error("Login failed");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // handlers
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const callbackUrl =
        new URLSearchParams(window.location.search).get("callbackUrl") ||
        "/dashboard";
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error("Google login error:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(msg);
      toast.error(msg);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Error Banner ── */}
      {error && (
        <Alert
          variant="destructive"
          className="animate-in fade-in-50 duration-200"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* ── Form Fields ── */}
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
                placeholder="name@example.com"
                heightClassName="h-10"
                autoComplete="email"
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </TanStackFormItem>

          <div>
            <TanStackFormItem
              required
              name="password"
              label="Password"
              labelProps={{
                className:
                  "col-span-12 mb-1 font-medium text-xs text-foreground",
              }}
              inputProps={{ className: "col-span-12" }}
            >
              {(field) => (
                <Input
                  type="password"
                  placeholder="Enter your password"
                  heightClassName="h-10"
                  autoComplete="current-password"
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </TanStackFormItem>

            <div className="mt-1.5 text-right">
              <Link
                href="/forget-password"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

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
                disabled={isLoading || !isValid || !canSubmit || !isDirty}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </TanStackFormProvider>

      {/* ── Divider ── */}
      <div className="relative flex items-center justify-center pt-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center bg-background px-3">
          <span className="text-xs font-medium text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* ── OAuth Google Button ── */}
      <Button
        variant="outline"
        type="button"
        className="w-full h-10 font-medium border-input hover:bg-accent transition-colors shadow-sm"
        disabled={isLoading || isGoogleLoading}
        onClick={handleGoogleSignIn}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Google...
          </>
        ) : (
          <>
            <GoogleIcon />
            Google
          </>
        )}
      </Button>
    </div>
  );
}
