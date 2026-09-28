#!/usr/bin/env node
/**
 * Guardrail: dates and times are rendered through the shared formatters
 * (`@/shared/utils/formatting/formatDate`), which pin the locale to en-IN.
 *
 * `toLocaleDateString()` / `toLocaleTimeString()` / `toLocaleString()` with no
 * locale argument use the *browser's* locale, so the same order renders
 * "3/14/2026" for a US visitor and "14/3/2026" for an Indian one — inside an
 * app whose copy, currency and number formatting are all en-IN.
 *
 * Rule: a locale-sensitive call must pass a locale-looking first argument (a
 * string literal such as "en-IN", or a variable/localised helper). Numbers
 * grouped with `toLocaleString()` count too.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

const LOCALE_CALL = /\.toLocale(Date|Time)?String\(/g;

function* codeFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* codeFiles(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

const isCommentLine = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);
const violations = [];

for (const file of codeFiles(srcDir)) {
  const relative = path.relative(root, file);
  if (relative.includes(`${path.sep}__tests__${path.sep}`)) continue;

  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (isCommentLine(line)) return;
    for (const match of line.matchAll(LOCALE_CALL)) {
      const after = line.slice(match.index + match[0].length).trimStart();
      // A locale argument is a string literal ("en-IN") or a variable holding one.
      const hasLocaleArgument =
        /^["'`]/.test(after) || /^[A-Za-z_$]/.test(after);
      if (hasLocaleArgument) continue;
      violations.push(`${relative}:${index + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}

if (violations.length > 0) {
  console.error(
    "Date/number formatting without a locale — use the shared en-IN formatters or pass a locale:\n",
  );
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("Locale-sensitive formatting always passes a locale.");
