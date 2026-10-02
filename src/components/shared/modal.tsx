"use client";

import * as React from "react";
import { cn } from "cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface StyledModalProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  visible?: boolean;
  onCancel?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  styles?: {
    header?: React.CSSProperties;
    body?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
  children: React.ReactNode;
  width?: number | string;
  footer?: React.ReactNode;
  overFlow?: boolean;
  overflow?: boolean;
  titleMargin?: string;
  [key: string]: unknown;
}

export const Modal = ({
  title,
  description,
  open,
  onCancel,
  onClose,
  onOpenChange,
  className,
  styles,
  width,
  footer,
  children,
  overFlow = true,
  overflow = true,
  titleMargin,

  ...rest
}: StyledModalProps) => {
  const enableOverflow = overflow ?? overFlow;

  const dialogContentRef = React.useRef<HTMLDivElement | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onCancel?.();
      onClose?.();
    }
    onOpenChange?.(nextOpen);
  };

  const dialogContentProps = description
    ? {}
    : ({ "aria-describedby": undefined } as const);

  const dialogWidthStyle = width
    ? {
        width: typeof width === "number" ? `${width}px` : width,
        maxWidth: "95vw",
      }
    : undefined;

  return (
    <Dialog open={open} modal={true} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={dialogContentRef}
        data-modal-content=""
        className={cn(
          "p-0 bg-background text-foreground rounded-2xl border border-border/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden sm:max-w-xl",
          className,
        )}
        style={dialogWidthStyle}
        {...dialogContentProps}
        {...rest}
      >
        {(title || description) && (
          <>
            <DialogHeader
              className="px-6 pt-6 pb-2 text-left"
              style={styles?.header}
            >
              {title ? (
                <DialogTitle className="text-lg font-bold text-foreground">
                  {title}
                </DialogTitle>
              ) : null}
              {description ? (
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
            <div className={cn("border-b border-border/60", titleMargin)} />
          </>
        )}

        <div
          className={cn(
            "flex-1 px-6 py-5 bg-background",
            enableOverflow
              ? "max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20"
              : "overflow-hidden",
          )}
          style={styles?.body}
        >
          <div
            className={cn(
              "transform-gpu transition-all duration-300 ease-in-out",
              "translate-y-0 opacity-100",
            )}
          >
            {children}
          </div>
        </div>

        {footer ? (
          <>
            <div className="border-t border-border/60" />
            <div
              className="px-6 py-4 bg-muted/30 flex items-center justify-end gap-3"
              style={styles?.footer}
            >
              {footer}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
