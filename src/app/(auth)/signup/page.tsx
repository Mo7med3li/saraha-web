import Link from "next/link";
import SignupForm from "./_components/signup-form";

export const metadata = {
  title: "Create an account — Saraha",
  description:
    "Join Saraha and start receiving honest, anonymous messages from people who matter.",
};

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join Saraha and start receiving honest, anonymous messages.
        </p>
      </header>

      <SignupForm />

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
