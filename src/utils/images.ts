import path from "node:path";

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export function isImage(file: string) {
  return VALID_EXTENSIONS.includes(path.extname(file).toLowerCase());
}

export function detectCover(files: string[]) {
  const cover = files.find((f) => f.toLowerCase().includes("cover"));
  return cover ?? null;
}
