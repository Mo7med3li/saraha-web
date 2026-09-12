import React, { createContext, useContext } from "react";
import {
  AnyFieldApi,
  FieldValidators,
  ReactFormExtendedApi,
} from "@tanstack/react-form";
import { cn } from "cn";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

function formatFieldErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    (error as { message?: unknown }).message != null
  ) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

/* Shared untyped shell — each screen still types its own useForm() values. */
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyReactFormApi = ReactFormExtendedApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
type AnyFieldValidators = FieldValidators<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
/* eslint-enable @typescript-eslint/no-explicit-any */

const TanStackFormContext = createContext<AnyReactFormApi | null>(null);

export function TanStackFormProvider({
  form,
  children,
}: {
  form: AnyReactFormApi;
  children: React.ReactNode;
}) {
  return (
    <TanStackFormContext.Provider value={form}>
      {children}
    </TanStackFormContext.Provider>
  );
}

export function useTanStackForm() {
  const form = useContext(TanStackFormContext);
  if (!form) {
    throw new Error("useTanStackForm must be used within TanStackFormProvider");
  }
  return form;
}

export interface TanStackFormItemProps {
  name: string;
  label?: string;
  labelDescription?: string;
  questionMarkTooltip?: string;
  labelClassName?: string;
  children: (field: AnyFieldApi) => React.ReactNode;
  validators?: AnyFieldValidators;
  inputProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.HTMLAttributes<HTMLDivElement>;
  required?: boolean;
  isLoading?: boolean;
  touched?: boolean;
}

const FormLabel = React.memo(
  ({
    label,
    labelDescription,
    labelClassName,
    name,
    required,
    isLoading,
  }: {
    label?: string;
    labelDescription?: string;
    labelClassName?: string;
    name: string;
    required?: boolean;
    isLoading?: boolean;
  }) => {
    if (isLoading) {
      return <Skeleton className="w-32 h-8 rounded-md" />;
    }

    if (!label) return null;

    return (
      <>
        <Label
          htmlFor={name}
          className={labelClassName}
          style={{ alignSelf: "start" }}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>

        {labelDescription && (
          <span className="text-xs text-gray-500">{labelDescription}</span>
        )}
      </>
    );
  },
);

FormLabel.displayName = "FormLabel";

export function TanStackFormItem({
  name,
  label,
  labelDescription,
  labelClassName,
  children,
  validators,
  inputProps,
  labelProps,
  required,
  touched = true,
  isLoading,
}: TanStackFormItemProps) {
  const form = useTanStackForm();

  return (
    <div
      className={cn(
        "grid grid-cols-12",
        (labelProps?.className || inputProps?.className) && "gap-2",
      )}
    >
      <div
        {...labelProps}
        className={cn(
          "flex flex-col col-span-12 lg:col-span-4",
          labelProps?.className,
        )}
      >
        <FormLabel
          label={label}
          labelDescription={labelDescription}
          labelClassName={labelClassName}
          name={name}
          required={required}
          isLoading={isLoading}
        />
      </div>

      <div
        {...inputProps}
        className={cn("lg:col-span-8 col-span-12", inputProps?.className)}
      >
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <form.Field name={name} validators={validators}>
            {(field: AnyFieldApi) => {
              const hasError = touched
                ? field.state.meta.isTouched && !field.state.meta.isValid
                : !field.state.meta.isValid;

              return (
                <>
                  {children(field)}

                  {hasError && field.state.meta.errors[0] != null && (
                    <p className="mb-0 mt-1 text-red-600 text-sm">
                      {formatFieldErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </>
              );
            }}
          </form.Field>
        )}
      </div>
    </div>
  );
}
