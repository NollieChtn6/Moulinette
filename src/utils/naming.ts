/**
 * Cleans a folder name by removing photographer suffixes.
 *
 * Example:
 * - "2026-04-01-my-folder_SOME_TEXT" > "2026-04-01-my-folder"
 *
 * The cleanup is done by splitting on "_" and keeping the first segment.
 *
 * @param name - Raw folder name
 * @returns Cleaned folder name without suffixes
 */
export function cleanFolderName(name: string): string {
  const cleaned = name.split("_")[0];
  return cleaned ?? name;
}
