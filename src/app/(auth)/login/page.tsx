import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to open your inbox and manage your link.
        </p>
      </header>
      <LoginForm />
    </div>
  );
}
