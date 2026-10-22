import { compressImageFile } from "./compress-image";

export const cropImageToCircle = (file: File) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      if (ctx) {
        ctx.clearRect(0, 0, size, size);

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        const xOffset = (img.width - size) / 2;
        const yOffset = (img.height - size) / 2;
        ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const fileName = file.name.replace(/\.[^/.]+$/, "") + ".png";
        const newFile = new File([blob], fileName, { type: "image/png" });
        compressImageFile(newFile).then(resolve).catch(reject);
      }, "image/png");
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Crop an image using react-easy-crop coordinates and return a compressed WebP File.
 */
export async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  cropShape: "rect" | "round" = "rect",
): Promise<File> {
  const cropped = await new Promise<File>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No 2d context");
      canvas.width = crop.width;
      canvas.height = crop.height;

      if (cropShape === "round") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          crop.width / 2,
          crop.height / 2,
          Math.min(crop.width, crop.height) / 2,
          0,
          2 * Math.PI,
        );
        ctx.closePath();
        ctx.clip();
      }
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );
      if (cropShape === "round") {
        ctx.restore();
      }
      const mimeType = cropShape === "round" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Canvas is empty");
          const file = new File(
            [blob],
            `cropped.${cropShape === "round" ? "png" : "jpg"}`,
            { type: mimeType },
          );
          resolve(file);
        },
        mimeType,
        1,
      );
    };
    image.onerror = (e) => reject(e);
    image.src = imageSrc;
  });

  return cropped;
}
