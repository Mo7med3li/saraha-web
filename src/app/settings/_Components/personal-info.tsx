"use client";

import {
  TanStackFormItem,
  TanStackFormProvider,
} from "@/src/components/shared/form-item";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { PhoneInput } from "@/src/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { useForm, useSelector } from "@tanstack/react-form";
import { Loader2, Save, UserCheck } from "lucide-react";
import { useMutationUpdateProfile } from "../_hooks/use-mutation-update-profile";
import {
  UpdateProfileFields,
  updateProfileSchema,
} from "../_schemas/update-profile.schema";

import { toast } from "sonner";

export default function PersonalInfo({ user }: { user: IUser }) {
  // hooks
  const { updateProfileMutation, isPending } = useMutationUpdateProfile();

  // Form
  const form = useForm({
    defaultValues: {
      userName: user?.userName || "",
      phoneNumber: user?.phoneNumber || "",
      gender: user?.gender || "male",
      email: user?.email || "",
    },
    validators: {
      onMount: updateProfileSchema,
      onChange: updateProfileSchema,
      onSubmit: updateProfileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const updatedFields: Partial<UpdateProfileFields> = {};

        if (value.userName !== (user?.userName || "")) {
          updatedFields.userName = value.userName;
        }
        if (value.phoneNumber !== (user?.phoneNumber || "")) {
          updatedFields.phoneNumber = value.phoneNumber;
        }
        if (value.gender !== (user?.gender || "male")) {
          updatedFields.gender = value.gender;
        }
        updatedFields.email = undefined;
        if (Object.keys(updatedFields).length === 0) {
          toast.info("No changes to save");
          return;
        }

        await updateProfileMutation(updatedFields as UpdateProfileFields);
      } catch (error) {
        form.reset();
        console.error(
          error instanceof Error ? error.message : "Failed to update profile",
        );
      }
    },
  });
  const isDirty = useSelector(form.store, (state) => state.isDirty);

  return (
    <TanStackFormProvider form={form}>
      <div className="w-full space-y-8">
        {/* ── SECTION 1: GENERAL PROFILE DETAILS ── */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-border/50">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <UserCheck className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Personal Information
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Update your display handle, phone number, and gender
                  preferences.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username Input */}
              <TanStackFormItem
                name="userName"
                label="Username"
                required
                inputProps={{ className: "col-span-12" }}
                labelProps={{ className: "col-span-12" }}
              >
                {(field) => (
                  <Input
                    id="username"
                    addonBefore="@"
                    placeholder="mohamed ali"
                    heightClassName="h-10"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={Boolean(
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0,
                    )}
                  />
                )}
              </TanStackFormItem>

              {/* Phone Number Input */}
              <TanStackFormItem
                required
                name="phoneNumber"
                label="Phone Number"
              >
                {(field) => (
                  <PhoneInput
                    onChange={(val) => field.handleChange(val)}
                    value={field.state.value}
                    name={field.name}
                    defaultCountry="EG"
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                    placeholder="Phone number"
                  />
                )}
              </TanStackFormItem>

              {/* Gender Input */}
              <TanStackFormItem required name="gender" label="Gender">
                {(field) => (
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    aria-invalid={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                    className="flex gap-6 pt-1"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="male"
                        id="male"
                        aria-invalid={
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                        }
                      />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="female"
                        id="female"
                        aria-invalid={
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                        }
                      />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                )}
              </TanStackFormItem>

              {/* Email Input */}
              <TanStackFormItem
                name="email"
                label="Email"
                required
                inputProps={{ className: "col-span-12" }}
                labelProps={{ className: "col-span-12" }}
              >
                {(field) => (
                  <Input
                    id="email"
                    addonBefore="@"
                    placeholder="j@example.com"
                    heightClassName="h-10"
                    value={field.state.value}
                    disabled
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={Boolean(
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0,
                    )}
                  />
                )}
              </TanStackFormItem>
            </div>

            {/* Save General Info Button */}
            <div className="flex justify-end pt-2 gap-2">
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
                    className="rounded-xl px-6 font-semibold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes…
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Information
                      </>
                    )}
                  </Button>
                )}
              </form.Subscribe>

              {isDirty && (
                <Button
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
                  variant="outline"
                  className="rounded-xl px-6 font-semibold cursor-pointer border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                >
                  Cancel Changes
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </TanStackFormProvider>
  );
}
