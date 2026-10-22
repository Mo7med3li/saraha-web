"use client";

import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, PauseCircle, Shield } from "lucide-react";

interface AccountStatusCardProps {
  user: IUser;
}

export function AccountStatusCard({ user }: AccountStatusCardProps) {
  const isFrozen = Boolean(user.deletedAt);
  const isAdmin = user.role === "admin";

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl border ${
              isFrozen
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            }`}
          >
            {isFrozen ? (
              <PauseCircle className="size-6" />
            ) : (
              <CheckCircle2 className="size-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {user.userName || "Saraha User"}
              </h3>
              <Badge
                variant={isFrozen ? "destructive" : "default"}
                className={`text-[11px] font-medium ${
                  isFrozen
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                }`}
              >
                {isFrozen ? "Frozen / Inactive" : "Active & Verified"}
              </Badge>
              {isAdmin && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                >
                  <Shield className="size-3 mr-1" /> Admin
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.email} • ID: <span className="font-mono">{user._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-left sm:text-right text-xs">
            <span className="text-muted-foreground block">Account Created</span>
            <span className="font-medium text-foreground">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
