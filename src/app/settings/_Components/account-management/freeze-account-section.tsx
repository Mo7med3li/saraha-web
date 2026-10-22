"use client";

import { Button } from "@/src/components/ui/button";
import { StyledDialog } from "@/src/components/ui/styled-dialog";
import { StyledSelect, type Option } from "@/src/components/ui/styled-select";
import { AlertTriangle, PauseCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useMutationAccountManagement } from "../../_hooks/use-mutation-account-management";
import { useAllUsers } from "../../_hooks/use-query-all-users";
import { getUserOptions } from "../../_utils";

interface FreezeAccountSectionProps {
  user: IUser;
}

export function FreezeAccountSection({ user }: FreezeAccountSectionProps) {
  const { freezeAccountMutation, isFreezePending } =
    useMutationAccountManagement();
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState(user._id);
  const isAdmin = user.role === "admin";
  const isAlreadyFrozen = Boolean(user.deletedAt);

  const { users = [], isLoading: isLoadingUsers } = useAllUsers(isAdmin);

  const userOptions: Option[] = useMemo(() => {
    return getUserOptions({ currentUser: user, users });
  }, [users, user]);

  const handleFreeze = async () => {
    try {
      // If admin specified another ID, pass it; otherwise freeze own account
      const idToFreeze =
        isAdmin && targetId !== user._id ? targetId : undefined;
      await freezeAccountMutation(idToFreeze);

      toast.success("Account frozen successfully");
      setOpen(false);

      // If freezing own account, sign out
      if (!idToFreeze || idToFreeze === user._id) {
        toast.info("Signing you out...", { duration: 3000 });
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 1200);
      }
    } catch (error) {
      console.error("Freeze error:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <PauseCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Freeze Account
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Temporarily deactivate your profile. Your link will stop receiving
              anonymous messages until restored.
            </p>
          </div>
        </div>

        <StyledDialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTargetId(user._id);
          }}
          variant="warning"
          icon={<AlertTriangle className="size-6" />}
          title="Freeze Account?"
          description="When you freeze an account, its public profile will stop receiving anonymous messages until reactivated."
          cancelText="Cancel"
          okText="Yes, Freeze Account"
          loadingText="Freezing…"
          okIcon={<PauseCircle className="size-4" />}
          isLoading={isFreezePending}
          onConfirm={handleFreeze}
          trigger={
            <Button
              variant="outline"
              disabled={isAlreadyFrozen}
              className="rounded-xl px-5 h-10 font-semibold cursor-pointer border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 whitespace-nowrap self-start sm:self-center"
            >
              {isAlreadyFrozen ? "Account Is Frozen" : "Freeze Account"}
            </Button>
          }
        >
          <div className="space-y-4 pt-1">
            <div className="space-y-2 rounded-xl bg-muted/40 p-4 border border-border/60 text-xs">
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                <li>
                  Your profile and public message link will be deactivated.
                </li>
                <li>You will not receive any new anonymous messages.</li>
                <li>Your existing messages and pictures remain safe.</li>
                <li>You will be immediately logged out of your session.</li>
              </ul>
            </div>

            {isAdmin && (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-foreground block">
                  Select User to Freeze (Admin):
                </label>
                <StyledSelect
                  options={userOptions}
                  value={targetId}
                  onChange={(val) => setTargetId(val as string)}
                  placeholder={
                    isLoadingUsers
                      ? "Loading users..."
                      : "Select user to freeze..."
                  }
                  searchable
                  className="rounded-xl border-amber-500/30 focus:border-amber-500 bg-background px-3"
                />
              </div>
            )}
          </div>
        </StyledDialog>
      </div>

      <div className="text-xs text-muted-foreground/80 leading-relaxed">
        <strong>Note:</strong> Freezing is non-destructive. You or a system
        administrator can restore your account whenever you decide to come back.
      </div>
    </div>
  );
}
