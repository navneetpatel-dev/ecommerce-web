#!/usr/bin/env node
/**
 * Guardrail: every confirmation looks and behaves the same because it is a `StatusDialog`
 * (shared/components/dialogs/StatusDialog.component.tsx).
 *
 * Rules:
 * 1. A `*Dialog` / `*Modal` file named like a confirmation may not build its own
 *    `DialogContent`.
 * 2. The browser's `window.confirm` is banned.
 *
 * Confirmations are recognised by file name, so one named differently is not caught.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

const CONFIRMATION_FILE =
  /(?:Confirm|Delete|Remove|Revoke|Discard|Approve|Retry|Submit|Logout|LoginRequired)[A-Za-z]*(?:Dialog|Modal)[A-Za-z]*\.tsx$/;

function* codeFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* codeFiles(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

const violations = [];

for (const file of codeFiles(srcDir)) {
  const relative = path.relative(srcDir, file).split(path.sep).join("/");
  const isConfirmation = CONFIRMATION_FILE.test(path.basename(relative));

  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      const where = `src/${relative}:${index + 1}`;
      if (isConfirmation && /<DialogContent(?=[\s/>]|$)/.test(line)) {
        violations.push(`${where}: build this confirmation with StatusDialog`);
      }
      if (/\bwindow\.confirm\(/.test(line)) {
        violations.push(`${where}: use StatusDialog instead of window.confirm`);
      }
    });
}

if (violations.length > 0) {
  console.error("Confirmations must use the shared StatusDialog:\n");
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("Confirmations use the shared StatusDialog.");
