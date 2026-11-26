#!/usr/bin/env node
/**
 * Guardrail: a bare "×" control (close, dismiss, remove, clear) is `IconCloseButton`
 * (shared/components/ui/icon-close-button.tsx), so every one of them looks and behaves the same.
 *
 * A raw lucide `<X ` is therefore banned, except in the primitive itself and in the few buttons that
 * pair the icon with a visible text label ("Clear all", "Cancel", "Clear selection"), where the icon is
 * decoration and not the control.
 *
 * Pure Node (no ripgrep).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

const ALLOWED = new Set([
  "shared/components/ui/icon-close-button.tsx",
  "features/products/components/filters/FilterSidebar/FilterSidebarHeader.component.tsx",
  "features/products/components/filters/AppliedFilterChips/AppliedFilterChip.component.tsx",
  "features/products/components/product-editor/variants/NewVariantRow.component.tsx",
  "shared/components/DataTable/FloatingBulkActionBar.component.tsx",
]);

function* codeFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* codeFiles(full);
    else if (/\.tsx$/.test(entry.name)) yield full;
  }
}

const offenders = [];
for (const file of codeFiles(srcDir)) {
  const rel = path.relative(srcDir, file).split(path.sep).join("/");
  if (ALLOWED.has(rel)) continue;
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (/<X[\s/>]/.test(line))
        offenders.push(`  src/${rel}:${index + 1}: ${line.trim()}`);
    });
}

if (offenders.length) {
  console.error(
    "Use <IconCloseButton> (shared/components/ui/icon-close-button) instead of a hand-built × button:\n" +
      offenders.join("\n"),
  );
  process.exit(1);
}
