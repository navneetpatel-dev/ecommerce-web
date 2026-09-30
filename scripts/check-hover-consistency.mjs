#!/usr/bin/env node
/**
 * Guardrail: a hover fill must be a step *lighter* than what it is painted on.
 *
 * `hover:bg-paper` reads as a faint grey on a white card in light mode — `paper`
 * is one shade below `surface` — but `paper` is the *page* token. In every dark
 * palette it is far darker (#121113 vs #1C1B1D), so the same class punches a
 * hole in the panel it hovers: the storefront nav's "Top Rated" link did
 * exactly that. Hover fills live in shared/styles/interaction.styles.ts and are
 * picked by background (`HOVER_ON_SURFACE`, `HOVER_ON_PAPER`, `HOVER_ON_DARK`).
 *
 * Rule: `hover:bg-paper` with no alpha, or with an alpha ≥ 30%, is banned.
 * Translucent overlays (`hover:bg-paper/10`, `/20`) stay legal — on media or a
 * brand fill the page token reads as a light wash in light mode and is what the
 * transparent header already ships — so only the "solid-ish page tint used as a
 * hover" cases fail.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

/** The one module allowed to name the page token as a hover — it defines the tokens. */
const TOKENS_SOURCE = "shared/styles/interaction.styles.ts";

const HOVER_PAPER = /hover:bg-paper(?![-\w])(?:\/(\d{1,3}))?/g;

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
  if (relative.endsWith(TOKENS_SOURCE)) continue;

  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (isCommentLine(line)) return;
    for (const match of line.matchAll(HOVER_PAPER)) {
      const alpha = match[1] ? Number(match[1]) : 100;
      if (alpha < 30) continue;
      violations.push(`${relative}:${index + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}

if (violations.length > 0) {
  console.error(
    "Hover fills using the page token — pick a token from shared/styles/interaction.styles.ts instead:\n",
  );
  console.error(
    "  on a panel (card, dropdown, table)  HOVER_ON_SURFACE / HOVER_ON_SURFACE_ROW",
  );
  console.error("  on the page background              HOVER_ON_PAPER");
  console.error("  on a brand fill or media            HOVER_ON_DARK\n");
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("Hover fills are theme-correct (no page-token hover fills).");
