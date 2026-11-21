import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// THE WORLD — Saturday 21 November 2026 front page.
// This program copies the pre-rendered entry image next to it into the
// output directory. It uses only the Node standard library and needs no
// network, so both runs write the same bytes.

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const target = join(outDir, "entry.png");

if (!existsSync(source)) {
  console.error(`entry.png not found next to main.ts: ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Verify the copy landed and is a real file before reporting success.
const written = statSync(target, { throwIfNoEntry: false });
if (!written || !written.isFile() || written.size === 0) {
  console.error(`failed to write a non-empty entry.png to ${target}`);
  process.exit(1);
}
console.log(`wrote ${target} (${written.size} bytes)`);
