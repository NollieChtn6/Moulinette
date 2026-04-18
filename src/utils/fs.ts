import fs from "fs-extra";

export async function getFolders(dir: string) {
  const entries = await fs.readdir(dir);
  const folders = [];

  for (const entry of entries) {
    const stat = await fs.stat(`${dir}/${entry}`);
    if (stat.isDirectory()) folders.push(entry);
  }

  return folders;
}
