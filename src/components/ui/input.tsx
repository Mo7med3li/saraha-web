"use client";

import * as React from "react";

import { cn } from "cn";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    error?: boolean;
    icon?: React.ReactNode;
    wrapperClassName?: string;
    heightClassName?: string;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
  }
>(
  (
    {
      className,
      type,
      error,
      icon,
      wrapperClassName,
      heightClassName = "h-8",
      addonBefore,
      addonAfter,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
      <div
        className={cn(
          "flex items-center w-full relative",
          addonBefore || addonAfter ? "gap-0" : "gap-2",
          wrapperClassName,
        )}
      >
        {addonBefore && (
          <div
            className={cn(
              "flex rounded-[10px] rounded-r-none items-center justify-center px-3 bg-muted border border-r-0 border-input rounded-l-[10px] text-muted-foreground text-sm whitespace-nowrap",
              heightClassName,
              error && "border-red-500 hover:border-red-500",
            )}
          >
            {addonBefore}
          </div>
        )}
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            "flex w-full rounded-[10px] border border-input hover:border-primary focus-visible:border-primary bg-background px-3 py-1 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:font-medium file:text-foreground file:border-0 file:bg-transparent file:text-sm",
            heightClassName,
            icon && !addonAfter && "pr-10",
            addonBefore && "rounded-l-none",
            addonAfter && "rounded-r-none",
            className,
            error &&
              "border-red-500 hover:border-red-500 focus-visible:border-red-500 focus-visible:ring-0 focus-visible:shadow-none",
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {showPassword ? (
              <EyeIcon
                size={15}
                onClick={toggleShowPassword}
                className="cursor-pointer text-gray-500"
              />
            ) : (
              <EyeOffIcon
                size={15}
                onClick={toggleShowPassword}
                className="cursor-pointer text-gray-500"
              />
            )}
          </span>
        )}
        {addonAfter && (
          <div
            className={cn(
              "flex items-center rounded-[10px] rounded-l-none justify-center px-3 bg-muted border border-l-0 border-input rounded-r-[10px] text-muted-foreground text-sm whitespace-nowrap",
              heightClassName,
              error && "border-red-500 hover:border-red-500",
            )}
          >
            {addonAfter}
          </div>
        )}
        {!addonAfter && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
