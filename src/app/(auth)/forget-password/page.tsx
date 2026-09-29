import Link from "next/link";
import ForgetPasswordForm from "./_components/forget-password-form";

export const metadata = {
  title: "Reset password — Saraha",
  description: "Reset your Saraha account password securely.",
};

export default function ForgetPasswordPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to verify your account and set a new password.
        </p>
      </header>

      <ForgetPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
