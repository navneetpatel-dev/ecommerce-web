#!/usr/bin/env node
/**
 * Guardrail: the ₹ glyph is rendered by the shared money formatter, never
 * concatenated at a call site.
 *
 * Allowed homes for the glyph:
 *   - src/shared/utils/formatting/orderFormat.ts (the single definition)
 *   - src/shared/constants/labels/** (user-facing copy templates; if a template
 *     has no glyph, the caller passes a formatted value)
 *   - `prefix="₹"` currency adornments on number inputs (an input affordance,
 *     not an amount render)
 *   - prose strings mentioning the denomination ("1 point = ₹1 off")
 *
 * Everything else must use `formatInr(...)` or `<MoneyAmount />`.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

const GLYPH = "\u20B9";

const skippedPathParts = [
  `${path.sep}shared${path.sep}constants${path.sep}labels${path.sep}`,
  `${path.sep}__tests__${path.sep}`,
  `${path.sep}styles${path.sep}`,
];
const skippedFiles = [
  path.join("shared", "utils", "formatting", "orderFormat.ts"),
];

/** Input adornments and fixed-denomination prose are not amount renders. */
const allowedLinePatterns = [/prefix=\{[^}]*CURRENCY_SYMBOL/, /₹1\b/];

const isCommentLine = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);

function* codeFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* codeFiles(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

const violations = [];

for (const file of codeFiles(srcDir)) {
  const relative = path.relative(root, file);
  if (skippedFiles.some((skip) => relative.endsWith(skip))) continue;
  if (skippedPathParts.some((part) => file.includes(part))) continue;

  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (!line.includes(GLYPH)) return;
    if (isCommentLine(line)) return;
    if (allowedLinePatterns.some((pattern) => pattern.test(line))) return;
    violations.push(`${relative}:${index + 1}: ${line.trim()}`);
  });
}

if (violations.length > 0) {
  console.error(
    "Inline currency glyph found — render amounts with formatInr()/MoneyAmount:\n",
  );
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("No inline currency glyphs outside the shared formatter/copy.");
