"use client";

import { ShieldCheck, Lock, KeyRound, CheckCircle2 } from "lucide-react";
import UpdatePasswordForm from "./update-password-form";

export default function SecurityTab() {
  return (
    <div className="w-full space-y-6 py-4">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Security Settings
          </h1>
        </div>
        <p className="text-sm text-muted-foreground pl-1">
          Manage your password, configure session security, and keep your
          account safe.
        </p>
      </div>

      {/* ── Main Password Change Section ── */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 shadow-sm">
        <UpdatePasswordForm />
      </div>

      {/* ── Security Tips & Highlights ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="size-4" />
            <span>Strong Characters</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use a combination of uppercase letters, numbers, and symbols to
            ensure maximum complexity.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Lock className="size-4" />
            <span>Session Control</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Choose to automatically invalidate active sessions across all
            devices when resetting passwords.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <KeyRound className="size-4" />
            <span>Never Reuse</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Avoid reusing passwords from other platforms to safeguard against
            external data leaks.
          </p>
        </div>
      </div>
    </div>
  );
}
