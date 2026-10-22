import { X, Plus, Images, Film } from "lucide-react";
import { useState } from "react";
import { arrayMoveImmutable } from "array-move";
import Image from "next/image";
import { SortableItem } from "react-easy-sort";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { SortWrapper } from "./SortWrapper";
import { cn } from "cn";
import { GalleryItem } from "@/src/lib/types/gallery";

interface GalleryModalContentProps<T extends GalleryItem> {
  value?: T[];
  onChange?: (value: T[]) => void;
  isLoading?: boolean;
}

export const GalleryModalDisplay = <T extends GalleryItem>({
  value = [],
  onChange,
  isLoading,
}: GalleryModalContentProps<T>) => {
  const [images, setImages] = useState<T[]>(value);
  const [selectedImage, setSelectedImage] = useState<T | null>(
    value.length > 0 ? value[0] : null,
  );

  const handleImageSelect = (image: T) => setSelectedImage(image);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const updatedImages = arrayMoveImmutable(images, oldIndex, newIndex).map(
      (currentItem, index) => ({
        ...currentItem,
        sequence: index + 1,
      }),
    );

    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const handleUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newImage = {
      id: objectUrl,
      media: { url: objectUrl, type: file.type, file: file },
      sequence: images.length + 1,
    } as T;
    const newImages = [...images, newImage];
    setImages(newImages);
    onChange?.(newImages);
    setSelectedImage(newImage);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isLt20M = file.size / 1024 / 1024 <= 20;
    if (!isLt20M) {
      toast.error("File Too Large", {
        description: `${file.name} is larger than 20MB.`,
      });
      return;
    }
    handleUpload(file);
    e.target.value = "";
  };

  const handleGalleryItemDelete = (id: string) => {
    const imageToDelete = images.find((image) => image.id === id);
    if (
      imageToDelete?.media?.url.startsWith("blob:") ||
      imageToDelete?.imageUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imageToDelete.media.url || imageToDelete.imageUrl);
    }

    const imageIdx = images.findIndex((image) => image.id === id);
    const newImages = images.filter((img) => img.id !== id);

    if (selectedImage?.id === id) {
      if (newImages.length === 0) {
        setSelectedImage(null);
      } else {
        setSelectedImage(newImages[Math.max(0, imageIdx - 1)]);
      }
    }

    setImages(newImages);
    onChange?.(newImages);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-62.5">
        <Spinner className="h-8 w-8 text-primary" />
        <span className="text-xs text-muted-foreground mt-2">
          Loading gallery…
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Active Main View Showcase ── */}
      <div className="relative aspect-video w-full flex items-center justify-center bg-card/60 border border-border/80 rounded-2xl min-h-55 max-h-80 overflow-hidden shadow-inner">
        {selectedImage ? (
          selectedImage?.media?.type?.includes("video") ? (
            <video
              className="h-full w-full object-contain rounded-xl"
              key={selectedImage.id}
              src={selectedImage.imageUrl || selectedImage.media.url}
              controls
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                key={selectedImage.id}
                src={selectedImage.imageUrl || selectedImage.media.url}
                id={selectedImage._id}
                fill
                unoptimized
                className="object-contain"
                alt="Selected gallery item"
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-3 p-6 text-center">
            <div className="p-4 rounded-full bg-muted/50 border border-border/60">
              <Images className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                No Gallery Media Added
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload photos or videos below to build your profile gallery.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Thumbnails & Sortable Strip ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 p-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <label className="shrink-0 cursor-pointer w-16 h-16 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all rounded-xl flex flex-col items-center justify-center gap-1 group shadow-xs">
          <input
            type="file"
            accept="image/*,video/mp4"
            className="hidden"
            onChange={handleFileChange}
          />
          <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary">
            Add
          </span>
        </label>

        <SortWrapper onSortEnd={onSortEnd} className="flex gap-3">
          {images.map((image) => (
            <SortableItem key={image.id}>
              <div className="relative group cursor-pointer h-16 w-16 shrink-0 select-none">
                <div
                  className={cn(
                    "h-full w-full rounded-xl overflow-hidden border border-border/80 transition-all shadow-xs",
                    selectedImage?.id === image.id
                      ? "ring-2 ring-primary border-primary scale-[1.03]"
                      : "hover:border-primary/50 opacity-80 hover:opacity-100",
                  )}
                  onClick={() => handleImageSelect(image)}
                >
                  {image?.media?.type?.includes("video") ? (
                    <div className="relative h-full w-full flex items-center justify-center bg-black/80">
                      <Film className="h-5 w-5 text-white/80" />
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <Image
                        src={image.imageUrl || image.media.url}
                        id={image._id}
                        fill
                        unoptimized
                        className="object-cover"
                        alt="Gallery thumbnail"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  title="Remove Image"
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGalleryItemDelete(image.id);
                  }}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </SortableItem>
          ))}
        </SortWrapper>
      </div>
    </div>
  );
};
