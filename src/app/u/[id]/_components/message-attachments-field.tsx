"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { AnyFieldApi } from "@tanstack/react-form";
import { Button } from "@/src/components/ui/button";
import { MESSAGE_ATTACHMENT_LIMITS } from "../_schema/send-message.schema";

type MessageAttachmentsFieldProps = {
  field: AnyFieldApi;
  disabled?: boolean;
};

export function MessageAttachmentsField({
  field,
  disabled,
}: MessageAttachmentsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = (field.state.value as File[]) ?? [];

  const previews = useMemo(
    () =>
      files.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previews]);

  const remaining = MESSAGE_ATTACHMENT_LIMITS.maxFiles - files.length;

  function addFiles(list: FileList | null) {
    if (!list || remaining <= 0) return;

    const next = [...files];
    for (const file of Array.from(list)) {
      if (next.length >= MESSAGE_ATTACHMENT_LIMITS.maxFiles) break;
      if (!MESSAGE_ATTACHMENT_LIMITS.acceptedTypes.includes(file.type)) continue;
      next.push(file);
    }
    field.handleChange(next);
    field.handleBlur();
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    field.handleChange(files.filter((_, i) => i !== index));
    field.handleBlur();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2.5">
        {previews.map((item, index) => (
          <div
            key={item.key}
            className="relative size-14 overflow-hidden rounded-2xl bg-muted sm:size-16"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.file.name}
              className="size-full object-cover"
            />
            <Button
              type="button"
              size="icon-xs"
              variant="secondary"
              disabled={disabled}
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 rounded-full bg-black/65 text-white hover:bg-black/80"
              aria-label={`Remove ${item.file.name}`}
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="flex size-14 flex-col items-center justify-center gap-0.5 rounded-2xl border border-dashed border-[oklch(0.78_0.03_200)] text-[oklch(0.42_0.04_200)] transition hover:border-[oklch(0.5_0.07_200)] hover:bg-[oklch(0.97_0.02_200)] hover:text-foreground disabled:pointer-events-none disabled:opacity-50 sm:size-16"
          >
            <ImagePlus className="size-4" />
            <span className="text-[10px] font-medium">Photo</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={MESSAGE_ATTACHMENT_LIMITS.acceptedTypes.join(",")}
        multiple={remaining > 1}
        className="hidden"
        disabled={disabled}
        onChange={(event) => addFiles(event.target.files)}
      />
    </div>
  );
}
