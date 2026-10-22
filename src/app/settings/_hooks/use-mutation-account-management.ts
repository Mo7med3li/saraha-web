"use client";

import { QueryKey, useMutation } from "@tanstack/react-query";
import { freezeAccountAction } from "../_actions/freeze-account.action";
import { restoreAccountAction } from "../_actions/restore-account.action";
import { deleteAccountAction } from "../_actions/delete-account.action";

export const useMutationAccountManagement = () => {
  const { mutateAsync: freezeAccountMutation, isPending: isFreezePending } =
    useMutation({
      mutationFn: (targetUserId?: string) => freezeAccountAction(targetUserId),
      meta: {
        loadingMessage: "Freezing account...",
        successMessage: "Account has been frozen successfully",
        errorMessage: "Failed to freeze account",
        invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
      },
    });

  const { mutateAsync: restoreAccountMutation, isPending: isRestorePending } =
    useMutation({
      mutationFn: (targetUserId: string) => restoreAccountAction(targetUserId),
      meta: {
        loadingMessage: "Restoring account...",
        successMessage: "Account restored successfully!",
        errorMessage: "Failed to restore account",
        invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
      },
    });

  const { mutateAsync: deleteAccountMutation, isPending: isDeletePending } =
    useMutation({
      mutationFn: (targetUserId: string) => deleteAccountAction(targetUserId),
      meta: {
        loadingMessage: "Permanently deleting account...",
        successMessage: "Account deleted permanently",
        errorMessage: "Failed to delete account",
        invalidatesQueries: ["user-profile"] as unknown as QueryKey[],
      },
    });

  return {
    freezeAccountMutation,
    isFreezePending,
    restoreAccountMutation,
    isRestorePending,
    deleteAccountMutation,
    isDeletePending,
  };
};
