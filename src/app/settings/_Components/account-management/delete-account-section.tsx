"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { StyledDialog } from "@/src/components/ui/styled-dialog";
import { StyledSelect, type Option } from "@/src/components/ui/styled-select";
import { AlertOctagon, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useMutationAccountManagement } from "../../_hooks/use-mutation-account-management";
import { useAllUsers } from "../../_hooks/use-query-all-users";
import { getUserOptions } from "../../_utils";

interface DeleteAccountSectionProps {
  user: IUser;
}

export function DeleteAccountSection({ user }: DeleteAccountSectionProps) {
  const { deleteAccountMutation, isDeletePending } =
    useMutationAccountManagement();
  const [open, setOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [targetId, setTargetId] = useState(user._id);
  const isAdmin = user.role === "admin";

  const { users = [], isLoading: isLoadingUsers } = useAllUsers(isAdmin);

  const isConfirmed = confirmationInput.trim().toUpperCase() === "DELETE";

  const userOptions: Option[] = useMemo(() => {
    return getUserOptions({ currentUser: user, users: users || [] });
  }, [users, user]);

  const handleDelete = async () => {
    if (!isConfirmed) return;

    try {
      const idToDelete = targetId || user._id;
      await deleteAccountMutation(idToDelete);

      toast.success("Account permanently deleted");
      setOpen(false);

      if (idToDelete === user._id) {
        toast.info("Signing you out...", { duration: 3000 });
        setTimeout(() => {
          signOut({ callbackUrl: "/signup" });
        }, 1200);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
            <Trash2 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-rose-600 dark:text-rose-400">
                Danger Zone: Delete Account
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full">
                Irreversible
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Permanently delete your Saraha account, username, uploaded gallery
              images, and all received messages.
            </p>
          </div>
        </div>

        <StyledDialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setConfirmationInput("");
          }}
          variant="danger"
          icon={<AlertOctagon className="size-6" />}
          title="Permanently Delete Account?"
          description="All of your messages, custom profile picture, gallery images, and account settings will be erased forever."
          cancelText="Cancel"
          okText="Permanently Delete"
          loadingText="Deleting Account…"
          okIcon={<Trash2 className="size-4" />}
          isLoading={isDeletePending}
          okDisabled={!isConfirmed}
          onConfirm={handleDelete}
          trigger={
            <Button
              variant="destructive"
              className="rounded-xl px-5 h-10 font-semibold cursor-pointer bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 whitespace-nowrap self-start sm:self-center"
            >
              <Trash2 className="mr-2 size-4" />
              Delete Account
            </Button>
          }
        >
          <div className="space-y-4 pt-1">
            {isAdmin && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground block">
                  Target User to Delete (Admin):
                </label>
                <StyledSelect
                  options={userOptions}
                  value={targetId}
                  onChange={(val) => setTargetId(val as string)}
                  placeholder={
                    isLoadingUsers
                      ? "Loading users..."
                      : "Select user to delete..."
                  }
                  searchable
                  className="rounded-xl border-rose-500/30 focus:border-rose-500 bg-background px-3"
                />
              </div>
            )}

            <div className="space-y-2 rounded-xl bg-rose-500/5 p-4 border border-rose-500/20">
              <label className="text-xs font-medium text-foreground block">
                Please type{" "}
                <strong className="text-rose-500 font-mono">DELETE</strong> to
                confirm:
              </label>
              <Input
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder="Type DELETE"
                heightClassName="h-10"
                className="font-mono text-center tracking-wider uppercase border-rose-500/30 focus-visible:border-rose-500"
                autoFocus
              />
            </div>
          </div>
        </StyledDialog>
      </div>

      <div className="text-xs text-rose-600/80 dark:text-rose-400/80 leading-relaxed font-medium">
        <strong>Warning:</strong> Deleting an account will wipe all cloud
        storage files, message inbox entries, and credentials. You cannot
        recover this account once deleted.
      </div>
    </div>
  );
}
