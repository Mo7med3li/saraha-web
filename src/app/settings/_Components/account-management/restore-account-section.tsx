"use client";

import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { StyledDialog } from "@/src/components/ui/styled-dialog";
import { StyledSelect, type Option } from "@/src/components/ui/styled-select";
import { useMutationAccountManagement } from "../../_hooks/use-mutation-account-management";
import { useAllUsers } from "../../_hooks/use-query-all-users";
import { toast } from "sonner";
import { CheckCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { getUserOptions } from "../../_utils";

interface RestoreAccountSectionProps {
  user: IUser;
}

export function RestoreAccountSection({ user }: RestoreAccountSectionProps) {
  const { restoreAccountMutation, isRestorePending } =
    useMutationAccountManagement();
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState(user._id);
  const isFrozen = Boolean(user.deletedAt);
  const isAdmin = user.role === "admin";

  const { users = [], isLoading: isLoadingUsers } = useAllUsers(isAdmin);

  const userOptions: Option[] = useMemo(() => {
    return getUserOptions({ currentUser: user, users });
  }, [users, user]);

  const handleRestore = async () => {
    try {
      const idToRestore = targetId || user._id;
      await restoreAccountMutation(idToRestore);
      toast.success("Account has been successfully restored!");
      setOpen(false);
    } catch (error) {
      console.error("Restore error:", error);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 shadow-xs space-y-5 transition-all ${
        isFrozen
          ? "border-emerald-500/40 bg-emerald-500/10 ring-2 ring-emerald-500/20"
          : "border-blue-500/20 bg-blue-500/5"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              isFrozen
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            }`}
          >
            <RotateCcw className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                Restore Account
              </h3>
              {isFrozen && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ready to Restore
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Reactivate a suspended or frozen account to resume receiving
              messages and make your profile publicly searchable again.
            </p>
          </div>
        </div>

        <StyledDialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTargetId(user._id);
          }}
          variant="success"
          icon={<ShieldCheck className="size-6" />}
          title="Reactivate Account?"
          description="Restoring this account will reactivate public messaging and clear suspension."
          cancelText="Cancel"
          okText="Confirm Restoration"
          loadingText="Restoring…"
          okIcon={<CheckCircle className="size-4" />}
          isLoading={isRestorePending}
          onConfirm={handleRestore}
          trigger={
            <Button
              variant={isFrozen ? "default" : "outline"}
              className={`rounded-xl px-5 h-10 font-semibold cursor-pointer whitespace-nowrap self-start sm:self-center ${
                isFrozen
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                  : "border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
              }`}
            >
              <RotateCcw className="mr-2 size-4" />
              Restore Account
            </Button>
          }
        >
          <div className="space-y-4 pt-1">
            <div className="space-y-2 rounded-xl bg-muted/40 p-4 border border-border/60 text-xs">
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                <li>
                  Make your profile and public message link active immediately.
                </li>
                <li>Allow anonymous visitors to send you messages again.</li>
                <li>Clear any temporary freeze suspension state.</li>
              </ul>
            </div>

            {isAdmin && (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-foreground block">
                  Select User to Restore (Admin):
                </label>
                <StyledSelect
                  options={userOptions}
                  value={targetId}
                  onChange={(val) => setTargetId(val as string)}
                  placeholder={
                    isLoadingUsers
                      ? "Loading users..."
                      : "Select user to restore..."
                  }
                  searchable
                  className="px-3 rounded-xl border-emerald-500/30 focus:border-emerald-500 bg-background"
                />
              </div>
            )}
          </div>
        </StyledDialog>
      </div>

      <div className="text-xs text-muted-foreground/80 leading-relaxed">
        <strong>Information:</strong> Restoring an account immediately brings
        back full functionality without losing any historical data, avatar, or
        received messages.
      </div>
    </div>
  );
}
