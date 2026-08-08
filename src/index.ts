import path from "node:path";
import fs from "fs-extra";
import sharp from "sharp";
import type { ImageEntry, ProcessMode } from "./@types/types.js";
import { getFolders } from "./utils/fs.js";
import { detectCover, isImage } from "./utils/images.js";
import { cleanFolderName } from "./utils/naming.js";
import { askMode } from "./utils/prompt.js";
import "dotenv/config";

/**
 * Absolute path to the input directory
 */
const INPUT_DIR = path.resolve(process.env.INPUT_DIR || "input");

/**
 * Absolute path to the output directory
 */
const OUTPUT_DIR = path.resolve(process.env.OUTPUT_DIR || "output");

/**
 * Maximum width (in pixels) for resized images
 */
const MAX_WIDTH = Number.parseInt(process.env.MAX_WIDTH || "1400", 10);

/**
 * Image quality (0-100) for the output images
 */
const QUALITY = Number.parseInt(process.env.QUALITY || "80", 10);

/**
 * Converts and renames a single image, saving it to the output folder.
 *
 * @param inputFile - Absolute path to the source image
 * @param outputPath - Absolute path to the destination folder
 * @param name - Cleaned folder name (used as the file prefix)
 * @param index - Position of the image in the sequence
 * @returns The generated filename
 */
async function convertImage(
  inputFile: string,
  outputPath: string,
  name: string,
  index: number,
): Promise<string> {
  const fileName = `${name}-photo-${String(index).padStart(3, "0")}.webp`;
  const outputFile = path.join(outputPath, fileName);

  await sharp(inputFile)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outputFile);

  const stats = await fs.stat(outputFile);

  console.log(`💾​ Saved: ${fileName} (${(stats.size / 1024).toFixed(1)} KB)`);

  return fileName;
}

/**
 * Process a single folder of images.
 *
 * Steps:
 * 1. Normalize folder name
 * 2. Skip if already processed
 * 3. Convert and rename images
 * 4. In "gallery" mode: detect the cover, order it first, and generate a JSON manifest
 *
 * @param folder - Folder name inside the input directory
 * @param mode - Processing mode selected by the user
 * @returns The processed folder name, or null if skipped
 */
async function processFolder(folder: string, mode: ProcessMode): Promise<string | null> {
  const rawName = path.basename(folder);
  const name = cleanFolderName(rawName);

  const inputPath = path.join(INPUT_DIR, folder);
  const outputPath = path.join(OUTPUT_DIR, name);

  if (await fs.pathExists(outputPath)) {
    const existingFiles = await fs.readdir(outputPath);

    if (existingFiles.length > 0) {
      console.log(`⏭️ Skipping ${name} (already processed)`);
      return null;
    }
  }

  console.log(`\n⚙️​ Processing folder: ${folder}`);

  await fs.ensureDir(outputPath);

  const files = (await fs.readdir(inputPath)).filter(isImage).sort();

  if (files.length === 0) {
    console.log(`⚠️  ${name} ignoré (aucune image)`);
    return null;
  }

  let orderedFiles = files;

  if (mode === "gallery") {
    const coverFile = detectCover(files);
    orderedFiles = coverFile ? [coverFile, ...files.filter((f) => f !== coverFile)] : files;
  }

  const images: ImageEntry[] = [];

  let index = 0;

  for (const file of orderedFiles) {
    const inputFile = path.join(inputPath, file);
    const fileName = await convertImage(inputFile, outputPath, name, index);

    if (mode === "gallery") {
      images.push({
        url: `${process.env.BASE_URL}/${name}/${fileName}`,
        alt: "",
      });
    }

    index++;
  }

  if (mode === "gallery") {
    const cover = images[0];

    if (!cover) {
      console.log(`⚠️ No cover generated for ${name}`);
      return null;
    }

    const jsonPath = path.join(outputPath, `${name}.json`);
    const json = {
      slug: name,
      cover: cover.url,
      images,
    };

    await fs.writeJson(jsonPath, json, { spaces: 2 });
  }

  console.log(`✅ Total images processed: ${index}`);

  return name;
}

/**
 * Entry point of the script.
 *
 * - Asks the user which processing mode to use
 * - Scans all folders in the input directory
 * - Processes each folder sequentially
 * - Logs execution summary and duration
 */
async function main(): Promise<void> {
  const start = Date.now();

  const mode = await askMode();

  console.log(`\n🚀 Starting in "${mode}" mode...\n`);

  const folders = await getFolders(INPUT_DIR);

  if (folders.length === 0) {
    console.log("❌ No folders found in input directory. Stopping.");
    return;
  }

  console.log(
    folders.length > 1 ? `📦 ${folders.length} folders detected` : "📦 1 folder detected",
  );

  console.log(folders);

  for (const folder of folders) {
    console.log(`\n🔍 Unpacking ${folder}`);
    await processFolder(folder, mode);
  }
  const duration = ((Date.now() - start) / 1000).toFixed(2);

  console.log(`\n🎉 Processing complete! Duration: ${duration} seconds.`);
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
});
