/** Client-side image compress → WebP ≤ 500 KB (mirrors backend knobs). */

export const MAX_IMAGE_BYTES = 500 * 1024;
export const MAX_LONG_EDGE_PX = 1920;
export const MIN_LONG_EDGE_PX = 320;
export const QUALITY_START = 0.8;
export const QUALITY_FLOOR = 0.4;
export const QUALITY_STEP = 0.1;
export const DIM_SHRINK = 0.85;

function withWebpName(name: string): string {
  const base = name.includes(".") ? name.replace(/\.[^.]+$/, "") : name;
  return `${base}.webp`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unsupported or corrupted image"));
    };
    img.src = url;
  });
}

function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image compression failed");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Compress an image File to WebP ≤ 500 KB.
 * Non-images returned as-is. If the browser cannot encode WebP, returns the original file
 * (backend still enforces size/format).
 *
 * ponytail: canvas quality×dim loop; ceiling is many encodes on huge images — upgrade to
 * OffscreenCanvas/worker if UI janks.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const beforeKb = (file.size / 1024).toFixed(1);
  const img = await loadImage(file);
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;
  if (!width || !height) {
    throw new Error("Unsupported or corrupted image");
  }

  const longEdge = Math.max(width, height);
  if (longEdge > MAX_LONG_EDGE_PX) {
    const scale = MAX_LONG_EDGE_PX / longEdge;
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
  }

  // Probe WebP support once
  const probe = await canvasToBlob(drawToCanvas(img, 2, 2), "image/webp", 0.8);
  if (!probe || probe.type !== "image/webp") {
    // ponytail: no client WebP — leave for backend
    console.info(
      `[image-compress] WebP unsupported; keeping original ${beforeKb} KB (${file.name})`,
    );
    return file;
  }

  while (true) {
    for (
      let quality = QUALITY_START;
      quality >= QUALITY_FLOOR - 1e-9;
      quality -= QUALITY_STEP
    ) {
      const canvas = drawToCanvas(img, width, height);
      const blob = await canvasToBlob(canvas, "image/webp", quality);
      if (blob && blob.size <= MAX_IMAGE_BYTES) {
        const out = new File([blob], withWebpName(file.name), {
          type: "image/webp",
          lastModified: Date.now(),
        });
        console.info(
          `[image-compress] ${beforeKb} KB → ${(out.size / 1024).toFixed(1)} KB (${out.name}, q=${quality.toFixed(1)}, ${width}x${height})`,
        );
        return out;
      }
    }

    const nextLong = Math.max(width, height) * DIM_SHRINK;
    if (nextLong < MIN_LONG_EDGE_PX) break;
    width = Math.max(1, Math.round(width * DIM_SHRINK));
    height = Math.max(1, Math.round(height * DIM_SHRINK));
  }

  throw new Error(
    "Image compression failed: could not reduce file under 500KB",
  );
}
