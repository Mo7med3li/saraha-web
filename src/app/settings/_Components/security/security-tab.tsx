"use client";

import { ShieldCheck, Lock, KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import { useProfile } from "../../_hooks/use-query-profile";
import UpdatePasswordForm from "./update-password-form";

export default function SecurityTab() {
  const { data: user, isLoading, error } = useProfile();
  const isGoogleAccount = user?.providers === "google";

  return (
    <div className="w-full space-y-6 py-4">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Security Settings
          </h1>
        </div>
        <p className="pl-1 text-sm text-muted-foreground">
          Manage your password, configure session security, and keep your
          account safe.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm sm:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
            <p className="text-sm text-muted-foreground">Loading security…</p>
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Could not load your account security options. Refresh and try again.
          </p>
        ) : isGoogleAccount ? (
          <div className="space-y-3 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-foreground">
              Signed in with Google
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This account uses Google sign-in, so there is no Saraha password to
              change. Manage your password in your{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
              >
                Google Account security settings
              </a>
              .
            </p>
          </div>
        ) : (
          <UpdatePasswordForm />
        )}
      </div>

      {!isGoogleAccount && !isLoading && !error ? (
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-border/60 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              <span>Strong Characters</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Use a combination of uppercase letters, numbers, and symbols to
              ensure maximum complexity.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Lock className="size-4" />
              <span>Session Control</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Choose to automatically invalidate active sessions across all
              devices when resetting passwords.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <KeyRound className="size-4" />
              <span>Never Reuse</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Avoid reusing passwords from other platforms to safeguard against
              external data leaks.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
