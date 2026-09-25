#!/usr/bin/env node
/**
 * Guardrail: feature code must not read err/error.message for user-facing display.
 * ESLint covers most cases; this line scan catches patterns ESLint may miss.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const featuresDir = path.join(root, "src", "features");

const allowlist = [
  "src/features/reports/hooks/table/useReportHubHelpers/index.ts",
  "src/features/checkout/hooks/checkout/useOrderPlacementErrorHandler.hook.ts",
];

const patterns = [
  /\b(err|error)\.message\b/,
  /\(err\s+as[^)]*\)\.message/,
  /\(error\s+as[^)]*\)\.message/,
];

/** Every non-hidden, non-binary file under `dir` (what ripgrep searched before). */
function* textFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* textFiles(full);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(full);
      if (!content.includes(0)) yield { full, text: content.toString("utf8") };
    }
  }
}

const violations = [];
for (const { full, text } of textFiles(featuresDir)) {
  const rel = path.relative(root, full).split(path.sep).join("/");
  if (allowlist.some((allowed) => rel.endsWith(allowed))) continue;
  text.split("\n").forEach((line, index) => {
    if (patterns.some((pattern) => pattern.test(line))) {
      violations.push(`${rel}:${index + 1}:${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error(
    "Raw err/error.message usage in features/ (use getApiErrorMessage instead):\n",
  );
  for (const line of violations) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}
