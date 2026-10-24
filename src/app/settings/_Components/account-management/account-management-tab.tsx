"use client";

import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { useProfile } from "../../_hooks/use-query-profile";
import { AccountStatusCard } from "./account-status-card";
import { FreezeAccountSection } from "./freeze-account-section";
import { RestoreAccountSection } from "./restore-account-section";
import { DeleteAccountSection } from "./delete-account-section";

export default function AccountManagementTab() {
  const { data: user, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-12 flex flex-col items-center justify-center space-y-4 min-h-100">
        <div className="relative">
          <Loader2 className="size-10 animate-spin text-rose-500" />
          <div className="absolute inset-0 size-10 animate-ping rounded-full bg-rose-500/20" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Loading account information…
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-12 flex flex-col items-center justify-center space-y-4 min-h-100 text-center">
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
          <AlertCircle className="size-8" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Failed to Load Account Data
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Unable to fetch account management details. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const isFrozen = Boolean(user.deletedAt);
  const isAdmin = user.role === "admin";

  // Regular users: freeze XOR restore by own status.
  // Admins: keep both so they can freeze/restore other accounts.
  const showFreeze = !isFrozen || isAdmin;
  const showRestore = isFrozen || isAdmin;

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Account Management
          </h1>
        </div>
        <p className="pl-1 text-sm text-muted-foreground">
          Control your account lifecycle — freeze, restore, or permanently
          delete your data.
        </p>
      </div>

      <AccountStatusCard user={user} />

      <div className="space-y-5">
        {showFreeze ? <FreezeAccountSection user={user} /> : null}
        {showRestore ? <RestoreAccountSection user={user} /> : null}
        <DeleteAccountSection user={user} />
      </div>
    </div>
  );
}
