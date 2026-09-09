#!/usr/bin/env node
/**
 * Guardrail: feature code must not read err/error.message for user-facing display.
 * ESLint covers most cases; this ripgrep pass catches patterns ESLint may miss.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const featuresDir = path.join(root, "src", "features");

const allowlist = [
  "src/features/reports/hooks/table/useReportHubHelpers/index.ts",
  "src/features/checkout/hooks/checkout/useOrderPlacementErrorHandler.hook.ts",
];

const patterns = [
  String.raw`\b(err|error)\.message\b`,
  String.raw`\(err\s+as[^)]*\)\.message`,
  String.raw`\(error\s+as[^)]*\)\.message`,
];

function runRipgrep(pattern) {
  try {
    return execFileSync(
      "rg",
      ["--no-heading", "--line-number", pattern, featuresDir],
      { encoding: "utf8", cwd: root },
    );
  } catch (err) {
    if (err.status === 1) {
      return "";
    }
    throw err;
  }
}

const violations = patterns
  .flatMap((pattern) => runRipgrep(pattern).trim().split("\n").filter(Boolean))
  .filter((line) => {
    const file = line.split(":")[0];
    const rel = path.relative(root, path.join(root, file));
    return !allowlist.some((allowed) => rel.endsWith(allowed));
  });

if (violations.length > 0) {
  console.error(
    "Raw err/error.message usage in features/ (use getApiErrorMessage instead):\n",
  );
  for (const line of [...new Set(violations)]) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}
