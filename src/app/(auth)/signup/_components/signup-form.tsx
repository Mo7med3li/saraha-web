"use client";
import { GoogleIcon } from "@/src/components/icons";
import { StepsIndicator } from "@/src/components/shared/steps-indicator";
import { Button } from "@/src/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import RailwayEmailAlert from "../../_components/railway-email-alert";
import ConfirmationStep from "./confirmation-step";
import RegisterStep from "./register-step";

const STEPS = [{ label: "Account" }, { label: "Verify" }];

export default function SignupForm() {
  // states
  const [step, setStep] = useState(1);

  // handlers
  const handleGoogleSignIn = () => {
    try {
      const callbackUrl =
        new URLSearchParams(window.location.search).get("callbackUrl") ||
        "/dashboard";
      void signIn("google", { callbackUrl });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google: " + (error as Error).message);
    }
  };

  return (
    <section className="space-y-6">
      {/* Railway email warning banner */}
      <RailwayEmailAlert />

      {/* ── Step indicator ── */}
      <StepsIndicator step={step} STEPS={STEPS} />

      {/* ── Step content ── */}
      <div className="auth-rise">
        {step === 1 && <RegisterStep setStep={setStep} />}
        {step === 2 && <ConfirmationStep setStep={setStep} />}
      </div>

      {/* ── Divider ── */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center bg-background px-2">
          <span className="text-xs font-medium text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
        <GoogleIcon />
        Google
      </Button>
    </section>
  );
}
