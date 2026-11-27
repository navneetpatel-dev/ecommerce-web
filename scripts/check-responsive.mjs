#!/usr/bin/env node
/**
 * Guardrail against the two class patterns that break phone layouts and can be seen in source.
 *
 * Rules (only for classes without a breakpoint or state prefix):
 * 1. No `w-[…]` / `min-w-[…]` of 20rem (320px) or more unless the same string caps it with
 *    `max-w-…`.
 * 2. No `grid-cols-4` or higher: four columns do not fit a phone.
 *
 * Everything else that overflows is found by `npm run audit:responsive`, which measures the
 * running app.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

/** Grids whose cells are small by nature, or that are hidden on phones. */
const MANY_COLUMNS_ALLOWED = new Set([
  "shared/styles/date-time-picker/dateTimePicker.styles.ts",
  "shared/styles/layout/footer.styles.ts",
  "shared/components/system/SocialShareGrid.component.tsx",
]);

const WIDTH = /(?<=["'`\s])(?:min-)?w-\[(\d+(?:\.\d+)?)(rem|px)\]/g;
const MANY_COLUMNS = /(?<=["'`\s])grid-cols-(?:[4-9]|1[0-2])(?![-\w])/;

function* codeFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* codeFiles(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

const violations = [];

for (const file of codeFiles(srcDir)) {
  const relative = path.relative(srcDir, file).split(path.sep).join("/");
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      const where = `src/${relative}:${index + 1}`;
      for (const [, size, unit] of line.matchAll(WIDTH)) {
        const pixels = Number(size) * (unit === "rem" ? 16 : 1);
        if (pixels >= 320 && !line.includes("max-w-")) {
          violations.push(`${where}: fixed width needs a max-w- cap`);
        }
      }
      if (MANY_COLUMNS.test(line) && !MANY_COLUMNS_ALLOWED.has(relative)) {
        violations.push(`${where}: use fewer columns below a breakpoint`);
      }
    });
}

if (violations.length > 0) {
  console.error("These classes overflow a phone screen:\n");
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("No fixed widths or column counts that overflow a phone.");
