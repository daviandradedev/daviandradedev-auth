export async function fileToAvatarDataUrl(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("INVALID_IMAGE_TYPE");
  if (file.size > 2 * 1024 * 1024) throw new Error("IMAGE_FILE_TOO_LARGE");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 256 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("CANVAS_UNAVAILABLE");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > 180_000 && quality > 0.45) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  if (dataUrl.length > 180_000) throw new Error("IMAGE_TOO_LARGE");
  return dataUrl;
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
}
