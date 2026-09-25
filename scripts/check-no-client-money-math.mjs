#!/usr/bin/env node
/**
 * Guardrail: the frontend displays money, it never calculates it.
 *
 * Every monetary figure must arrive from the API already computed by the backend
 * pricing engine (ecommerce-backend/src/modules/pricing). This flags any
 * arithmetic expression (`+ - * / % **` and compound assignment) with a
 * money-named operand, found by walking the TypeScript syntax tree — see
 * scripts/lib/moneyMath.mjs. Formatting (grouping, the ₹ prefix, compact
 * notation) is display, not calculation, and is allowlisted below.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findMoneyArithmetic, findRawMoneyDisplay } from "./lib/moneyMath.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

/**
 * Each entry needs a reason. Keeping this list short is the point — every
 * exception should be a deliberate decision, not a place to hide new math.
 * An entry that no longer has any finding fails the check, so the list only shrinks.
 */
const allowlist = {
  // Pure display formatters: compact notation over a final amount.
  "src/shared/utils/formatting/orderFormat.ts": "₹ lakh/crore compact display",
  "src/shared/utils/formatting/formatPoints.ts": "K/M points compact display",
  // `total` here is a row/item count, not money.
  "src/shared/api/client/pagination.ts": "page count from item total",
  "src/shared/hooks/pagination/useClientPagination.hook.ts":
    "page count from item total",
  "src/shared/hooks/exports/useExportJobsWatcher.hook.ts":
    "export progress % from row total",
  "src/features/admin-dashboard/components/analytics/AnalyticsStatusChart.component.tsx":
    "status share % from order count total",
};

/** Tests build fixtures; constants/ holds display strings and route paths only. */
const SKIPPED_DIRS = new Set(["__tests__", "constants", "node_modules"]);

function* sourceFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) yield* sourceFiles(full);
    } else if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/\.(test|spec)\.(ts|tsx)$/.test(entry.name) &&
      !entry.name.endsWith(".d.ts")
    ) {
      yield full;
    }
  }
}

/** The shared formatters are where money display belongs; nothing else formats ₹ by hand. */
const FORMATTING_DIR = "src/shared/utils/formatting/";

const violations = [];
const displayViolations = [];
const usedAllowlist = new Set();

for (const file of sourceFiles(srcDir)) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  const sourceText = fs.readFileSync(file, "utf8");
  if (!rel.startsWith(FORMATTING_DIR)) {
    for (const finding of findRawMoneyDisplay(sourceText, file)) {
      displayViolations.push(`  ${rel}:${finding.line}  ${finding.text}`);
    }
  }
  const findings = findMoneyArithmetic(sourceText, file);
  if (findings.length === 0) continue;
  if (rel in allowlist) {
    usedAllowlist.add(rel);
    continue;
  }
  for (const finding of findings) {
    violations.push(`  ${rel}:${finding.line}  ${finding.text}`);
  }
}

const staleEntries = Object.keys(allowlist).filter(
  (rel) => !usedAllowlist.has(rel),
);

if (violations.length > 0) {
  console.error(
    "Client-side money arithmetic in src/ (money is computed by the backend and only displayed here):\n",
  );
  console.error(violations.join("\n"));
  console.error(
    "\nAsk the backend to return the computed value instead. If it genuinely cannot come\n" +
      "from the API, add the file to the allowlist in scripts/check-no-client-money-math.mjs\n" +
      "with a reason.",
  );
}

if (displayViolations.length > 0) {
  console.error(
    "\nMoney displayed without the shared formatters (toFixed, or ₹ before a raw value):\n",
  );
  console.error(displayViolations.join("\n"));
  console.error(
    "\nUse formatInr / formatInrExact / formatInrAmount from src/shared/utils/formatting/orderFormat.ts.",
  );
}

if (staleEntries.length > 0) {
  console.error(
    "\nAllowlist entries with no money arithmetic left (remove them from scripts/check-no-client-money-math.mjs):\n",
  );
  console.error(staleEntries.map((rel) => `  ${rel}`).join("\n"));
}

if (
  violations.length > 0 ||
  displayViolations.length > 0 ||
  staleEntries.length > 0
) {
  process.exit(1);
}
