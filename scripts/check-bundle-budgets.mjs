#!/usr/bin/env node
/**
 * §10 bundle-size budget gate: fails when the shipped client-side JS exceeds
 * its gzipped ceiling. Works with Next 16 / Turbopack output (.next/static).
 * Run after `next build`:  `npm run build && npm run budgets`
 *
 * The repo-root CI workflow invokes this after the build step so a budget
 * regression blocks merge like a failing test.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "..");
const STATIC_DIR = path.join(ROOT, ".next", "static");

/**
 * Budget ceilings (gzipped bytes):
 * - TOTAL_CLIENT_JS_BUDGET: entire shipped client JS across all chunks.
 *   A single route's first load is always <= this value because route code
 *   is split into per-route entry groups; growth here means the shared
 *   graph (or any lazy boundary leak) got heavier.
 */
const TOTAL_CLIENT_JS_BUDGET_BYTES = 1200 * 1024;
const SINGLE_CHUNK_BUDGET_BYTES = 400 * 1024;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else yield full;
  }
}

if (!readdirSyncSafe(STATIC_DIR)) {
  console.error("No .next/static found. Run `npm run build` first.");
  process.exit(1);
}

function readdirSyncSafe(dir) {
  try {
    readdirSync(dir);
    return true;
  } catch {
    return false;
  }
}

const chunks = [];
let total = 0;
for (const file of walk(STATIC_DIR)) {
  if (!file.endsWith(".js") || file.endsWith(".map")) continue;
  const size = zlib.gzipSync(readFileSync(file)).length;
  total += size;
  chunks.push({ file: path.relative(STATIC_DIR, file), size });
}

chunks.sort((a, b) => b.size - a.size);
let failures = 0;

if (total > TOTAL_CLIENT_JS_BUDGET_BYTES) {
  failures += 1;
  console.error(
    `BUDGET EXCEEDED: total client JS is ${(total / 1024).toFixed(1)} KB gzipped (ceiling ${TOTAL_CLIENT_JS_BUDGET_BYTES / 1024} KB)`,
  );
}

for (const chunk of chunks.slice(0, 5)) {
  if (chunk.size > SINGLE_CHUNK_BUDGET_BYTES) {
    failures += 1;
    console.error(
      `BUDGET EXCEEDED: ${chunk.file} is ${(chunk.size / 1024).toFixed(1)} KB gzipped (single-chunk ceiling ${SINGLE_CHUNK_BUDGET_BYTES / 1024} KB)`,
    );
  }
}

console.log("Largest client chunks (gzipped):");
for (const { file, size } of chunks.slice(0, 10)) {
  console.log(`${(size / 1024).toFixed(1).padStart(9)} KB  ${file}`);
}
console.log(
  `\nTotal client JS: ${(total / 1024).toFixed(1)} KB gzipped ` +
    `(ceiling ${TOTAL_CLIENT_JS_BUDGET_BYTES / 1024} KB).`,
);

process.exit(failures === 0 ? 0 : 1);
