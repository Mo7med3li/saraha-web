import { getCroppedImg } from "@/src/lib/utils/image.utils";
import { AnyFieldApi } from "@tanstack/react-form";
import { cn } from "cn";
import { saveAs } from "file-saver";
import {
  CloudUpload,
  Download,
  Eye,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  RotateCw,
  Undo,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { useTanStackForm } from "./form-item";
import { Modal } from "./modal";

// ── Image Preview Overlay Component ──
const ImagePreview = ({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden group rounded-xl",
          !isOpen && "cursor-pointer",
        )}
      >
        <img src={src} alt={alt} className={className} style={style} />
        <div
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out backdrop-blur-xs"
        >
          <Eye className="h-5 w-5" />
          <span className="text-sm font-medium">Preview Image</span>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            handleReset();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in-0 duration-200"
        >
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              handleReset();
            }}
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close Preview</span>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center p-4 rounded-2xl overflow-hidden"
          >
            <img
              src={src}
              alt={alt}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) scaleX(${
                  flipX ? -1 : 1
                }) scaleY(${flipY ? -1 : 1})`,
                transition: "transform 0.2s ease-out",
                maxHeight: "65vh",
                maxWidth: "85vw",
                objectFit: "contain",
              }}
              className="rounded-lg shadow-2xl"
            />

            {/* Glassmorphism Floating Toolbar */}
            <div className="mt-6 flex items-center gap-2 bg-black/60 border border-white/10 backdrop-blur-md text-white rounded-full px-5 py-2.5 shadow-2xl">
              <button
                type="button"
                title="Download"
                onClick={() => saveAs(src, "image.webp")}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                title="Flip Vertical"
                onClick={() => setFlipY(!flipY)}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <FlipVertical className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Flip Horizontal"
                onClick={() => setFlipX(!flipX)}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <FlipHorizontal className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                title="Rotate Counter-clockwise"
                onClick={() => setRotation(rotation - 90)}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Rotate Clockwise"
                onClick={() => setRotation(rotation + 90)}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                title="Zoom Out"
                onClick={() => setScale(Math.max(0.5, scale - 0.25))}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Zoom In"
                onClick={() => setScale(Math.min(3, scale + 0.25))}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                title="Reset View"
                onClick={handleReset}
                className="p-1.5 hover:text-primary transition-colors cursor-pointer"
              >
                <Undo className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Image Upload Field ──
const ImageUploadField = ({
  field,
  defaultValue,
  label,
  required,
  horizontallyAligned,
  banner,
  errorMessage,
  aspect,
  cropShape = "rect",
  uploadTitle,
  classNames,
  minHeight,
  maxHeight,
  onImageSelect,
}: {
  field: AnyFieldApi;
  defaultValue?: string | File | null;
  label: string;
  required?: boolean;
  horizontallyAligned?: boolean;
  banner?: boolean;
  aspect?: number;
  errorMessage?: string;
  uploadTitle?: string;
  classNames?: string;
  cropShape?: "rect" | "round";
  minHeight?: number;
  maxHeight?: number;
  onImageSelect?: (file: File) => void;
}) => {
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // react-easy-crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update imageUrl when field value or defaultValue changes
  const fieldValue = field.state.value;
  const imageUrl = useMemo(() => {
    if (fileDataUrl) return fileDataUrl;
    if (typeof defaultValue === "string") return defaultValue;
    return null;
  }, [fileDataUrl, defaultValue]);

  // Sync fileDataUrl with fieldValue when it's a File
  useEffect(() => {
    if (fieldValue instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(fieldValue);
    } else if (defaultValue instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(defaultValue);
    } else {
      // Clear cached data URL when value is not a File (e.g., after form reset)
      // This is necessary to sync component state with form state
      requestAnimationFrame(() => setFileDataUrl(null));
    }
  }, [fieldValue, defaultValue]);

  // Process File helper
  const processFile = async (file: File) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";

    if (!isJpgOrPng) {
      alert("You can only upload JPG, PNG, or WEBP files!");
      return;
    }

    try {
      if (aspect) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
          setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
        return;
      }

      setCompressing(true);
      field.handleChange(file);
      onImageSelect?.(file);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Image compression failed. Please try another image.",
      );
    } finally {
      setCompressing(false);
    }
  };

  // File input change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Cropper handlers
  const onCropComplete = (
    croppedArea: { x: number; y: number; width: number; height: number },
    croppedPixels: { x: number; y: number; width: number; height: number },
  ) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const onCropCancel = () => {
    setCropModalOpen(false);
    setSelectedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropConfirm = async () => {
    if (!selectedImage || !croppedAreaPixels || compressing) return;
    setCompressing(true);
    try {
      const croppedFile = await getCroppedImg(
        selectedImage,
        croppedAreaPixels,
        cropShape,
      );
      field.handleChange(croppedFile);
      onImageSelect?.(croppedFile);
      setCropModalOpen(false);
      setSelectedImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Image compression failed. Please try another image.",
      );
    } finally {
      setCompressing(false);
    }
  };

  // Get error message
  const fieldError =
    field.state.meta.isTouched && field.state.meta.errors?.length
      ? field.state.meta.errors[0]?.message
      : undefined;
  const displayError = errorMessage || fieldError;

  const containerClass = horizontallyAligned
    ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
    : "flex flex-col gap-4";

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label className="font-semibold text-sm text-foreground flex items-center gap-1">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div className={containerClass}>
        {/* Dropzone & Preview Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden bg-card/50",
            isDragging
              ? "border-primary bg-primary/10 ring-4 ring-primary/20 scale-[1.01]"
              : "border-border/80 hover:border-primary/50 hover:bg-muted/30",
          )}
          style={{
            minHeight: `${minHeight || (banner ? 150 : 220)}px`,
            maxHeight: `${maxHeight || (banner ? 200 : 350)}px`,
          }}
        >
          {compressing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-xs text-foreground">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-xs font-semibold">Compressing Image…</span>
            </div>
          )}

          {imageUrl ? (
            <ImagePreview
              src={imageUrl}
              alt={label || "Uploaded image"}
              className={cn(
                "w-full rounded-xl object-contain max-h-75",
                classNames,
              )}
            />
          ) : (
            <div
              onClick={openFilePicker}
              className="flex flex-col items-center justify-center p-6 text-center cursor-pointer space-y-2 select-none"
            >
              <div className="p-3.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <CloudUpload className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SVG, PNG, JPG, or WEBP (Max 500KB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Input */}
        <div className="flex flex-col justify-center space-y-2">
          {displayError && (
            <span className="text-destructive text-xs font-medium">
              {displayError}
            </span>
          )}

          <input
            ref={fileInputRef}
            id={`file-upload-${field.name}`}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={compressing}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={openFilePicker}
            disabled={compressing}
            className="w-full rounded-xl cursor-pointer py-2.5 font-medium transition-colors"
          >
            {compressing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                Compressing…
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4 text-muted-foreground" />
                {uploadTitle ||
                  (imageUrl
                    ? "Change Image"
                    : `Upload ${banner ? "Banner" : "Image"}`)}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Crop Modal */}
      <Modal
        open={cropModalOpen}
        onCancel={onCropCancel}
        title="Crop Image"
        description="Adjust image framing and zoom level"
        width={560}
        footer={
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex-1 flex items-center gap-3">
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider
                min={1}
                max={3}
                step={0.01}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={onCropCancel}
                disabled={compressing}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onCropConfirm}
                disabled={compressing}
                className="rounded-xl"
              >
                {compressing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Compressing…
                  </>
                ) : (
                  "Crop & Save"
                )}
              </Button>
            </div>
          </div>
        }
      >
        <div className="relative w-full h-80 rounded-xl overflow-hidden bg-black/90">
          {selectedImage && (
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect || 1}
              cropShape={cropShape}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

// ── Exported Component for Forms ──
export const ImageUploader = ({
  name,
  defaultValue,
  label,
  required,
  horizontallyAligned,
  banner,
  errorMessage,
  aspect,
  cropShape = "rect",
  uploadTitle,
  classNames,
  minHeight = banner ? 150 : 250,
  maxHeight = banner ? 200 : 350,
  onImageSelect,
}: {
  name: string;
  defaultValue?: string | File | null;
  label: string;
  required?: boolean;
  horizontallyAligned?: boolean;
  banner?: boolean;
  aspect?: number;
  errorMessage?: string;
  uploadTitle?: string;
  classNames?: string;
  cropShape?: "rect" | "round";
  minHeight?: number;
  maxHeight?: number;
  onImageSelect?: (file: File) => void;
}) => {
  const form = useTanStackForm();
  return (
    <form.Field name={name}>
      {(field: AnyFieldApi) => (
        <ImageUploadField
          field={field}
          defaultValue={defaultValue}
          label={label}
          required={required}
          horizontallyAligned={horizontallyAligned}
          banner={banner}
          errorMessage={errorMessage}
          aspect={aspect}
          cropShape={cropShape}
          uploadTitle={uploadTitle}
          classNames={classNames}
          minHeight={minHeight}
          maxHeight={maxHeight}
          onImageSelect={onImageSelect}
        />
      )}
    </form.Field>
  );
};
