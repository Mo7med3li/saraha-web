import Link from "next/link";
import LoginForm from "./_components/login-form";

export const metadata = {
  title: "Sign in — Saraha",
  description:
    "Sign in to open your inbox and manage your anonymous feedback link.",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to open your inbox and manage your link.
        </p>
      </header>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
