"use client";

import { useState } from "react";
import SendOtp from "./send-otp";
import VerifyOtp from "./verify-otp";
import ResetPassword from "./reset-password";
import { StepsIndicator } from "@/src/components/shared/steps-indicator";
import RailwayEmailAlert from "../../_components/railway-email-alert";
// steps configuration
const steps = [
  { label: "Send OTP" },
  { label: "Verify OTP" },
  { label: "Reset Password" },
];

export default function ForgetPasswordForm() {
  // states
  const [step, setStep] = useState<
    "send-otp" | "verify-otp" | "reset-password"
  >("reset-password");

  // handlers
  const getActiveStep = (): number => {
    if (step === "send-otp") return 1;
    if (step === "verify-otp") return 2;
    return 3;
  };

  return (
    <section className="space-y-6">
      {/* ── Railway email warning banner ── */}
      <RailwayEmailAlert />

      {/* ── Steps Indicator ── */}
      <StepsIndicator step={getActiveStep()} STEPS={steps} />

      {/* ── Steps Content ── */}
      <div className="auth-rise">
        {step === "send-otp" && <SendOtp onStepChange={setStep} />}
        {step === "verify-otp" && <VerifyOtp onStepChange={setStep} />}
        {step === "reset-password" && <ResetPassword onStepChange={setStep} />}
      </div>
    </section>
  );
}
