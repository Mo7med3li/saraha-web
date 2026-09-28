"use client"

import * as React from "react"
import { cn } from "cn"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(
        // Base layout
        "relative flex h-12 w-12 items-center justify-center",
        // Typography
        "text-base font-semibold tracking-widest text-foreground",
        // Shape & background
        "rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm",
        // Shadow for depth
        "shadow-sm",
        // Smooth transitions
        "transition-all duration-200 ease-out",
        // Filled state — subtle highlight
        "data-[filled=true]:border-primary/40 data-[filled=true]:bg-primary/5",
        // Active / focused state — glowing ring
        "data-[active=true]:border-primary/70 data-[active=true]:bg-background",
        "data-[active=true]:ring-4 data-[active=true]:ring-primary/20",
        "data-[active=true]:shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_4px_16px_hsl(var(--primary)/0.15)]",
        "data-[active=true]:scale-105",
        // Invalid state
        "aria-invalid:border-destructive/70",
        "data-[active=true]:aria-invalid:ring-destructive/20",
        "data-[active=true]:aria-invalid:shadow-[0_0_0_1px_hsl(var(--destructive)/0.3)]",
        className
      )}
      {...props}
    >
      {char}

      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-[1.5px] animate-caret-blink rounded-full bg-primary duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className="flex items-center text-border/60"
      {...props}
    >
      <MinusIcon className="size-3.5" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
