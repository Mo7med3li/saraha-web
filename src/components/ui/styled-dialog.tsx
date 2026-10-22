"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { cn } from "cn";

export type DialogVariant =
  | "default"
  | "primary"
  | "danger"
  | "destructive"
  | "warning"
  | "success"
  | "info";

export type ButtonTypeColor =
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "success";

interface VariantStyleConfig {
  contentBorder: string;
  iconContainer: string;
  subTitleClass: string;
  defaultSubTitle?: string;
  okButton: string;
  defaultLoadingText: string;
}

const VARIANT_CONFIG: Record<
  "default" | "danger" | "warning" | "success" | "info",
  VariantStyleConfig
> = {
  default: {
    contentBorder: "border-border",
    iconContainer: "bg-primary/10 text-primary border-primary/20",
    subTitleClass: "text-muted-foreground",
    defaultSubTitle: undefined,
    okButton:
      "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20",
    defaultLoadingText: "Processing…",
  },
  danger: {
    contentBorder: "border-rose-500/30",
    iconContainer:
      "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    subTitleClass: "text-rose-500 font-medium",
    defaultSubTitle: "This action is final and cannot be undone.",
    okButton:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20",
    defaultLoadingText: "Deleting…",
  },
  warning: {
    contentBorder: "border-amber-500/30",
    iconContainer:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    subTitleClass: "text-amber-600 dark:text-amber-400 font-medium",
    defaultSubTitle: "Please proceed with caution.",
    okButton:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20",
    defaultLoadingText: "Proceeding…",
  },
  success: {
    contentBorder: "border-emerald-500/30",
    iconContainer:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    subTitleClass: "text-emerald-600 dark:text-emerald-400 font-medium",
    defaultSubTitle: undefined,
    okButton:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
    defaultLoadingText: "Confirming…",
  },
  info: {
    contentBorder: "border-blue-500/30",
    iconContainer:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    subTitleClass: "text-blue-600 dark:text-blue-400 font-medium",
    defaultSubTitle: undefined,
    okButton:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20",
    defaultLoadingText: "Processing…",
  },
};

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  cancelText?: string;
  okText?: string;
  loadingText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: DialogVariant;
  cancelTypeColor?: ButtonTypeColor;
  okTypeColor?: ButtonTypeColor;
  cancelVariant?: "outline" | "filled" | "ghost" | "text";
  isLoading?: boolean;
  okDisabled?: boolean;
  testIdPrefix?: string;
  trigger?: React.ComponentProps<typeof DialogTrigger>["render"];
  children?: React.ReactNode;
  contentClassName?: string;
  okIcon?: React.ReactNode;
  okButtonClassName?: string;
  cancelButtonClassName?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  description,
  icon,
  cancelText = "Cancel",
  okText = "Confirm",
  loadingText,
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false,
  okDisabled = false,
  trigger,
  children,
  contentClassName,
  okIcon,
  okButtonClassName,
  cancelButtonClassName,
}: ConfirmationDialogProps) {
  const normalizedVariant: keyof typeof VARIANT_CONFIG =
    variant === "destructive"
      ? "danger"
      : variant === "primary"
        ? "default"
        : variant;

  const config = VARIANT_CONFIG[normalizedVariant] || VARIANT_CONFIG.default;
  const activeSubTitle =
    subtitle !== undefined ? subtitle : config.defaultSubTitle;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent
        data-modal-content=""
        className={cn(
          "sm:max-w-md rounded-2xl border-border bg-card p-6 shadow-2xl",
          config.contentBorder,
          contentClassName,
        )}
      >
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  "p-3 rounded-xl border shrink-0",
                  config.iconContainer,
                )}
              >
                {icon}
              </div>
            )}
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {title}
              </DialogTitle>
              {activeSubTitle && (
                <p
                  className={cn(
                    "text-xs font-medium mt-0.5",
                    config.subTitleClass,
                  )}
                >
                  {activeSubTitle}
                </p>
              )}
            </div>
          </div>

          {description && (
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className="space-y-4 pt-1">{children}</div>}

        <DialogFooter className="gap-2 sm:gap-2 pt-3">
          {cancelText && (
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-xl font-medium cursor-pointer",
                    cancelButtonClassName,
                  )}
                  onClick={() => {
                    onCancel?.();
                  }}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
              }
            />
          )}
          <Button
            onClick={onConfirm}
            disabled={isLoading || okDisabled}
            className={cn(
              "rounded-xl font-semibold cursor-pointer disabled:opacity-40 transition-all",
              config.okButton,
              okButtonClassName,
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {loadingText || config.defaultLoadingText}
              </>
            ) : (
              <>
                {okIcon && (
                  <span className="mr-2 inline-flex items-center">
                    {okIcon}
                  </span>
                )}
                {okText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmationDialog as StyledDialog };
export default ConfirmationDialog;
