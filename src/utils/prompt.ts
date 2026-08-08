import { cancel, intro, isCancel, select } from "@clack/prompts";
import type { ProcessMode } from "../@types/types.js";

/**
 * Asks the user which processing mode to use before execution.
 *
 * - "gallery": cover detection + JSON manifest generation for a frontend site.
 * - "simple": conversion and renaming only, no cover or JSON.
 *
 * Exits the process if the user cancels the prompt (Ctrl+C).
 *
 * @returns The selected processing mode
 */
export async function askMode(): Promise<ProcessMode> {
  intro("🌀 Magic Moulinette");

  const mode = await select<ProcessMode>({
    message: "Which mode do you want to use?",
    options: [
      {
        value: "gallery",
        label: "🖼️  Gallery",
        hint: "Cover + JSON for a website",
      },
      {
        value: "simple",
        label: "🗂️  Simple",
        hint: "Conversion + renaming only",
      },
    ],
  });

  if (isCancel(mode)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  return mode;
}
