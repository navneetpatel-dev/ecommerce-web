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
  "src/features/reports/hooks/useReportHubHelpers/index.ts",
  "src/features/checkout/hooks/usePlaceOrder.hook.ts",
];

const pattern = String.raw`\b(err|error)\.message\b`;

let output = "";
try {
  output = execFileSync(
    "rg",
    ["--no-heading", "--line-number", pattern, featuresDir],
    { encoding: "utf8", cwd: root },
  );
} catch (err) {
  if (err.status === 1) {
    process.exit(0);
  }
  console.error(err.message ?? err);
  process.exit(1);
}

const violations = output
  .trim()
  .split("\n")
  .filter(Boolean)
  .filter((line) => {
    const file = line.split(":")[0];
    const rel = path.relative(root, path.join(root, file));
    return !allowlist.some((allowed) => rel.endsWith(allowed));
  });

if (violations.length > 0) {
  console.error(
    "Raw err/error.message usage in features/ (use getApiErrorMessage instead):\n",
  );
  for (const line of violations) {
    console.error(`  ${line}`);
  }
  process.exit(1);
}
