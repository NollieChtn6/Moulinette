import path from "node:path";

/**
 * List of supported image file extensions.
 */
const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Checks if a file is a supported image type.
 *
 * Supported formats:
 * - .jpg
 * - .jpeg
 * - .png
 * - .webp
 *
 * @param file - Filename including extension
 * @returns True if the file is a valid image format
 */
export function isImage(file: string): boolean {
  return VALID_EXTENSIONS.includes(path.extname(file).toLowerCase());
}

/**
 * Detects a cover image from a list of filenames.
 *
 * The cover is defined as any file whose name contains "cover" (case-insensitive).
 *
 * @param files - Array of filenames
 * @returns The cover filename if found, otherwise null
 */
export function detectCover(files: string[]): string | null {
  const cover = files.find((f) => f.toLowerCase().includes("cover"));
  return cover ?? null;
}
