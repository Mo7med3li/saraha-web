"use client";

import { cn } from "cn";
import { X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "./badge";

type TagProps = {
  children: React.ReactNode;
  color?: string;
  closable?: boolean;
  onClose?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  bordered?: boolean;
  className?: string;
  status?: "success" | "processing" | "error" | "warning" | "default";
};

type TagTone = {
  bg: string;
  border: string;
  text: string;
};

/** Light-mode pastels (Ant-style). */
const lightTones: Record<string, TagTone> = {
  success: { bg: "#f6ffed", border: "#b7eb8f", text: "#389e0d" },
  processing: { bg: "#e6f4ff", border: "#91caff", text: "#0958d9" },
  error: { bg: "#fff1f0", border: "#ffa39e", text: "#cf1322" },
  warning: { bg: "#fffbe6", border: "#ffe58f", text: "#d48806" },
  default: { bg: "#fafafa", border: "#d9d9d9", text: "rgba(0,0,0,.88)" },
  blue: { bg: "#e6f4ff", border: "#91caff", text: "#0958d9" },
  purple: { bg: "#f9f0ff", border: "#d3adf7", text: "#531dab" },
  cyan: { bg: "#e6fffb", border: "#87e8de", text: "#08979c" },
  green: { bg: "#f6ffed", border: "#b7eb8f", text: "#389e0d" },
  magenta: { bg: "#fff0f6", border: "#ffadd2", text: "#c41d7f" },
  pink: { bg: "#fff0f6", border: "#ffadd2", text: "#c41d7f" },
  red: { bg: "#fff1f0", border: "#ffa39e", text: "#cf1322" },
  orange: { bg: "#fff7e6", border: "#ffd591", text: "#d46b08" },
  yellow: { bg: "#fffbe6", border: "#ffe58f", text: "#d48806" },
  volcano: { bg: "#fff2e8", border: "#ffbb96", text: "#d4380d" },
  geekblue: { bg: "#f0f5ff", border: "#adc6ff", text: "#1d39c4" },
  lime: { bg: "#fcffe6", border: "#eaff8f", text: "#7cb305" },
  gold: { bg: "#fffbe6", border: "#ffe58f", text: "#d48806" },
  gray: { bg: "#fafafa", border: "#d9d9d9", text: "rgba(0,0,0,.65)" },
  black: { bg: "#f5f5f5", border: "#d9d9d9", text: "rgba(0,0,0,.88)" },
};

/** Dark-mode: tinted surfaces + light text (no white/pastel chips on dark UI). */

// Tag Component
export const Tag = ({
  children,
  color,
  closable = false,
  onClose,
  icon,
  bordered = true,
  className = "",
  status,
  ...props
}: TagProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    if (onClose) {
      onClose(e);
    }
  };

  if (!visible) return null;

  const isHexColor =
    color && typeof color === "string" && color.startsWith("#");
  const toneKey = status || color || "default";
  const tone =
    lightTones[toneKey as keyof typeof lightTones] ?? lightTones.default;

  let style: React.CSSProperties = {};

  if (isHexColor) {
    style = {
      backgroundColor: color,
      color: "#fff",
      border: "none",
    };
  } else {
    style = {
      backgroundColor: tone.bg,
      color: tone.text,
      border: bordered ? `1px solid ${tone.border}` : "none",
    };
  }

  return (
    <Badge
      variant={"none"}
      className={cn(
        "flex w-fit items-center justify-center gap-1 px-2 py-0.5 text-xs font-normal rounded-md transition-all",
        className,
      )}
      style={style}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
      {closable && (
        <button
          onClick={handleClose}
          className="ml-0.5 hover:opacity-70 transition-opacity inline-flex items-center"
          style={{ color: isHexColor ? "#fff" : style.color }}
          aria-label="Close tag"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </Badge>
  );
};
