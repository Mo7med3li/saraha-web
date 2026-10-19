"use client";

import { useMutationUpdatePassword } from "@/src/app/settings/_hooks/use-mutation-update-password";
import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import PasswordStrengthIndicator from "@/src/components/shared/strenth-password";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { LOGOUT_ENUM } from "@/src/lib/constants/api.constant";
import { useForm, useSelector } from "@tanstack/react-form";
import {
  Check,
  Globe,
  KeyRound,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  UpdatePasswordFields,
  updatePasswordSchema,
} from "../../_schemas/update-password.schema";

const FLAG_CONFIG = {
  [LOGOUT_ENUM.STAY_LOGGED_IN]: {
    label: "Stay logged in on this device",
    description: "Keep your current active session without signing out.",
    icon: Laptop,
    badgeColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  [LOGOUT_ENUM.SIGNED_OUT_FROM_CURRENT_DEVICE]: {
    label: "Sign out from this device only",
    description:
      "End this session immediately. You will be redirected to login.",
    icon: LogOut,
    badgeColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  [LOGOUT_ENUM.SIGNED_OUT_FROM_ALL]: {
    label: "Sign out from all devices (Recommended)",
    description: "Terminate sessions on all devices for maximum security.",
    icon: Globe,
    badgeColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  },
} as const;

export default function UpdatePasswordForm() {
  // hooks
  const { updatePasswordMutation, isPending } = useMutationUpdatePassword();

  // form
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      flag: LOGOUT_ENUM.STAY_LOGGED_IN as UpdatePasswordFields["flag"],
    },
    validators: {
      onChange: updatePasswordSchema,
      onMount: updatePasswordSchema,
      onSubmit: updatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updatePasswordMutation(value);
        toast.success("Password updated successfully!");

        if (
          value.flag === LOGOUT_ENUM.SIGNED_OUT_FROM_ALL ||
          value.flag === LOGOUT_ENUM.SIGNED_OUT_FROM_CURRENT_DEVICE
        ) {
          toast.info("Signing you out according to your session preference...");
          setTimeout(() => {
            signOut({ callbackUrl: "/login" });
          }, 1200);
        } else {
          form.reset();
        }
      } catch (error) {
        console.error("Error updating password:", error);
      }
    },
  });

  // form values
  const isDirty = useSelector(form.store, (state) => state.isDirty);
  const newPasswordValue = useSelector(
    form.store,
    (state) => state.values.newPassword,
  );
  const confirmPasswordValue = useSelector(
    form.store,
    (state) => state.values.confirmPassword,
  );

  return (
    <div className="w-full">
      <TanStackFormProvider form={form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Top Form Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Update Account Password
              </h3>
              <p className="text-xs text-muted-foreground">
                Ensure your account is protected with a unique, robust password.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Old Password */}
            <TanStackFormItem
              required
              name="oldPassword"
              label="Current Password"
              labelProps={{
                className:
                  "col-span-12 mb-1.5 font-medium text-xs text-foreground",
              }}
              inputProps={{ className: "col-span-12" }}
            >
              {(field) => (
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  heightClassName="h-11"
                  autoComplete="current-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />
              )}
            </TanStackFormItem>

            {/* New Password & Strength Meter */}
            <div className="space-y-2.5">
              <TanStackFormItem
                required
                name="newPassword"
                label="New Password"
                labelProps={{
                  className:
                    "col-span-12 mb-1.5 font-medium text-xs text-foreground",
                }}
                inputProps={{ className: "col-span-12" }}
              >
                {(field) => (
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    heightClassName="h-11"
                    autoComplete="new-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                )}
              </TanStackFormItem>

              {/* Password Strength Progress Bar & Checkpoints */}
              {newPasswordValue && (
                <PasswordStrengthIndicator
                  newPasswordValue={newPasswordValue}
                />
              )}
            </div>

            {/* Confirm New Password */}
            <TanStackFormItem
              required
              name="confirmPassword"
              label="Confirm New Password"
              labelProps={{
                className:
                  "col-span-12 mb-1.5 font-medium text-xs text-foreground",
              }}
              inputProps={{ className: "col-span-12" }}
            >
              {(field) => (
                <Input
                  type="password"
                  placeholder="Re-enter your new password"
                  heightClassName="h-11"
                  autoComplete="new-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />
              )}
            </TanStackFormItem>

            {/* Match Indicator Hint */}
            {confirmPasswordValue && newPasswordValue && (
              <div className="flex items-center gap-2 text-xs px-1">
                {confirmPasswordValue === newPasswordValue ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <Check className="size-4" /> Passwords match
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                    <X className="size-4" /> Passwords do not match yet
                  </span>
                )}
              </div>
            )}

            {/* Flag / Session Management Option */}
            <TanStackFormItem
              required
              name="flag"
              label="Session Management After Password Change"
              labelProps={{
                className:
                  "col-span-12 mb-1.5 font-medium text-xs text-foreground",
              }}
              inputProps={{ className: "col-span-12" }}
            >
              {(field) => {
                const currentConfig =
                  FLAG_CONFIG[field.state.value as keyof typeof FLAG_CONFIG] ||
                  FLAG_CONFIG[LOGOUT_ENUM.STAY_LOGGED_IN];
                const CurrentIcon = currentConfig.icon;

                return (
                  <div className="space-y-3">
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        if (val) {
                          field.handleChange(
                            val as UpdatePasswordFields["flag"],
                          );
                        }
                      }}
                    >
                      <SelectTrigger
                        triggerClassName="h-11 px-3.5 rounded-xl border-input hover:border-emerald-500 focus-visible:ring-emerald-500 bg-background"
                        error={
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                        }
                      >
                        <SelectValue placeholder="Choose session action">
                          <span className="flex items-center gap-2.5 text-xs sm:text-sm">
                            <CurrentIcon className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-medium text-foreground">
                              {currentConfig.label}
                            </span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent className="rounded-xl border border-border shadow-xl p-1 bg-popover z-50">
                        {Object.entries(FLAG_CONFIG).map(([flagKey, item]) => {
                          const ItemIcon = item.icon;
                          return (
                            <SelectItem
                              key={flagKey}
                              value={flagKey}
                              className="rounded-lg p-2.5 cursor-pointer hover:bg-muted/80 focus:bg-emerald-500/10 focus:text-foreground text-foreground"
                            >
                              <div className="flex items-start gap-2.5 py-0.5">
                                <div
                                  className={`p-1.5 rounded-md mt-0.5 border shrink-0 ${item.badgeColor}`}
                                >
                                  <ItemIcon className="size-3.5" />
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="font-semibold text-xs sm:text-sm">
                                    {item.label}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                                    {item.description}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    {/* Active Selected Flag Explanatory Banner */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                      <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">
                          {currentConfig.label}:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {currentConfig.description}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            </TanStackFormItem>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border/50">
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="w-full sm:w-auto rounded-xl px-5 h-10 font-semibold cursor-pointer border-border hover:bg-muted"
              >
                Discard Changes
              </Button>
            )}

            <form.Subscribe
              selector={(state) => ({
                isValid: state.isValid,
                canSubmit: state.canSubmit,
                isDirty: state.isDirty,
              })}
            >
              {({ isValid, canSubmit, isDirty }) => (
                <Button
                  type="submit"
                  disabled={isPending || !isValid || !canSubmit || !isDirty}
                  className="w-full sm:w-auto rounded-xl px-7 h-10 font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating Password…
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 size-4" />
                      Update Password
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </TanStackFormProvider>
    </div>
  );
}
