import fs from "fs-extra";

/**
 * Reads a directory and returns all subfolder names.
 *
 * This function filters out files and only keeps directories.
 *
 * @param dir - Absolute or relative path to the directory to scan
 * @returns A promise that resolves to an array of folder names (not full paths)
 */
export async function getFolders(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir);
  const folders = [];

  for (const entry of entries) {
    const stat = await fs.stat(`${dir}/${entry}`);
    if (stat.isDirectory()) folders.push(entry);
  }

  return folders;
}
