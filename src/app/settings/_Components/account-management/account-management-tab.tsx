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

  return (
    <div className="w-full space-y-6">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Account Management
          </h1>
        </div>
        <p className="text-sm text-muted-foreground pl-1">
          Control your account lifecycle, temporarily suspend operations, restore access, or permanently delete your data.
        </p>
      </div>

      {/* ── Status Card ── */}
      <AccountStatusCard user={user} />

      {/* ── Action Sections ── */}
      <div className="space-y-5">
        {/* Freeze Account Section */}
        <FreezeAccountSection user={user} />

        {/* Restore Account Section */}
        <RestoreAccountSection user={user} />

        {/* Danger Zone: Delete Account */}
        <DeleteAccountSection user={user} />
      </div>
    </div>
  );
}
