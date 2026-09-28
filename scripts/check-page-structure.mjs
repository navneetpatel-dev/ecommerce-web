#!/usr/bin/env node
/**
 * Guardrail for the two page-structure rules the shells depend on:
 *
 *  1. Every `<main>` carries `id={MAIN_CONTENT_ID}`. The skip link and the route
 *     announcer both target that id, so a shell without it silently breaks them
 *     (the link goes nowhere, focus never moves).
 *  2. Every surface that can be landed on directly has a page heading:
 *     - a feature with a `pages/` directory must contain an `<h1>` (visually
 *       hidden is fine — see the listing page),
 *     - a route file under `src/app` that renders `<main>` must contain an
 *       `<h1>` too (error boundaries included: they replace the shell).
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");
const featuresDir = path.join(srcDir, "features");
const appDir = path.join(srcDir, "app");

/** Anything that renders a level-one heading, including motion/as wrappers. */
const HAS_H1 = /h1[\s>"'`]/;

/**
 * Features whose pages legitimately have no `<h1>`.
 * Keep the reason: a stale entry fails the run.
 */
const headingAllowlist = new Map([
  // e.g. ["src/features/example", "heading comes from the shared shell"],
]);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.tsx$/.test(entry.name)) yield full;
  }
}

function readLines(file) {
  return fs.readFileSync(file, "utf8").split("\n");
}

const isCommentLine = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);
const relative = (file) => path.relative(root, file);
const violations = [];
const usedAllowlist = new Set();

// Rule 1 — skip-link/route-announcer target on every landmark.
for (const file of walk(srcDir)) {
  readLines(file).forEach((line, index) => {
    if (isCommentLine(line)) return;
    if (!/<main[\s>]/.test(line)) return;
    if (line.includes("id={MAIN_CONTENT_ID}")) return;
    violations.push(
      `${relative(file)}:${index + 1}: <main> without id={MAIN_CONTENT_ID} — ` +
        "the skip link and route announcer cannot reach it",
    );
  });
}

// Rule 2a — a feature with pages must render an <h1> somewhere.
for (const entry of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const featureDir = path.join(featuresDir, entry.name);
  if (!fs.existsSync(path.join(featureDir, "pages"))) continue;

  const hasHeading = [...walk(featureDir)].some((file) =>
    readLines(file).some((line) => HAS_H1.test(line) && !isCommentLine(line)),
  );
  if (hasHeading) continue;

  const key = path.relative(root, featureDir);
  if (headingAllowlist.has(key)) {
    usedAllowlist.add(key);
    continue;
  }
  violations.push(`${key}: has pages but no <h1> anywhere in the feature`);
}

// Rule 2b — an app route that renders <main> (error boundaries included) needs one too.
for (const file of walk(appDir)) {
  const lines = readLines(file);
  const rendersMain = lines.some(
    (line) => /<main[\s>]/.test(line) && !isCommentLine(line),
  );
  if (!rendersMain) continue;
  if (lines.some((line) => HAS_H1.test(line) && !isCommentLine(line))) continue;
  violations.push(`${relative(file)}: renders <main> without an <h1>`);
}

if (violations.length > 0) {
  console.error(
    "Page-structure problems — each one breaks the skip link, the route announcer or screen-reader navigation:\n",
  );
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

const unused = [...headingAllowlist.keys()].filter(
  (key) => !usedAllowlist.has(key),
);
if (unused.length > 0) {
  console.error(
    "Stale page-structure allowlist entries (remove or re-justify):\n",
  );
  for (const key of unused) console.error(`  ${key}`);
  process.exit(1);
}

console.log("Page structure OK (landmark ids + page headings).");
