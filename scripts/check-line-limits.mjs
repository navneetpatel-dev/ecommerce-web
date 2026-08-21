#!/usr/bin/env node
/**
 * Rule 3 / Rule 28 enforcement: fails when any file exceeds its hard line
 * ceiling. Current violations are recorded in scripts/line-limits-baseline.json
 * (a ratchet): CI passes only if the violation list does not GROW. Remove an
 * entry from the baseline when the file is fixed.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BASELINE_PATH = path.join(
  import.meta.dirname,
  "line-limits-baseline.json",
);

// file glob suffix -> hard ceiling (Rule 3)
const CEILINGS = [
  {
    test: (f) =>
      f.startsWith("src/app/") &&
      /\/(page|layout|loading|error|not-found)\.tsx$/.test(f),
    ceiling: 120,
  },
  {
    test: (f) => f.startsWith("src/features/") && f.includes("/hooks/"),
    ceiling: 150,
  },
  { test: (f) => f.startsWith("src/shared/hooks/"), ceiling: 150 },
  { test: (f) => /\.(ts|tsx)$/.test(f), ceiling: 200 },
];

function ceilingFor(file) {
  for (const { test, ceiling } of CEILINGS) {
    if (test(file)) return ceiling;
  }
  return null;
}

const files = execFileSync("git", ["ls-files", "*.ts", "*.tsx"], {
  cwd: ROOT,
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const violations = {};
for (const file of files) {
  const ceiling = ceilingFor(file);
  if (!ceiling) continue;
  const lines = readFileSync(path.join(ROOT, file), "utf8").split("\n").length;
  if (lines > ceiling) violations[file] = { lines, ceiling };
}

const baseline = existsSync(BASELINE_PATH)
  ? JSON.parse(readFileSync(BASELINE_PATH, "utf8"))
  : {};

const currentKeys = Object.keys(violations).sort();

const newViolations = currentKeys.filter((k) => !(k in baseline));
const grownViolations = currentKeys.filter(
  (k) => k in baseline && violations[k].lines > baseline[k].lines,
);

if (process.argv.includes("--init")) {
  writeFileSync(BASELINE_PATH, JSON.stringify(violations, null, 2) + "\n");
  console.log(
    `Baseline created with ${currentKeys.length} existing violations. CI now ratchets from here.`,
  );
} else if (newViolations.length === 0 && grownViolations.length === 0) {
  // Ratchet down: drop fixed files and updated (reduced) counts from baseline.
  const nextBaseline = {};
  for (const key of currentKeys) nextBaseline[key] = violations[key];
  writeFileSync(BASELINE_PATH, JSON.stringify(nextBaseline, null, 2) + "\n");
  console.log(
    `Line limits OK (${currentKeys.length} pre-existing violations tracked in baseline).`,
  );
} else {
  for (const key of newViolations) {
    console.error(
      `NEW VIOLATION: ${key} is ${violations[key].lines} lines (ceiling ${violations[key].ceiling})`,
    );
  }
  for (const key of grownViolations) {
    console.error(
      `GREW: ${key} is now ${violations[key].lines} lines (was ${baseline[key].lines}, ceiling ${violations[key].ceiling})`,
    );
  }
  process.exit(1);
}
