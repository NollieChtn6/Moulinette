export function cleanFolderName(name: string): string {
  const cleaned = name.split("_")[0];
  return cleaned ?? name;
}
