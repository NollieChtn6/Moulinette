export type ImageEntry = {
  url: string;
  alt: string;
};

/**
 * Processing mode selected by the user before execution.
 *
 * - "gallery": detects a cover, orders it first, and generates a JSON manifest for a frontend site.
 * - "simple": converts and renames images only, in alphabetical order, without cover or JSON.
 */
export type ProcessMode = "gallery" | "simple";
