#!/usr/bin/env node
/**
 * Guardrail: every row ⋮ menu looks the same because its entries are `RowActionButton`s.
 * `TableRowActions` keeps its children hidden and draws the menu from what they register,
 * so a hand-rolled button there would silently never appear.
 *
 * Rules:
 * 1. No `<Button>` / `<button>` between `<TableRowActions>` and `</TableRowActions>`.
 * 2. No `<Button>` / `<button>` in `*RowActions*.tsx` or `return*Actions.tsx` files.
 * 3. The old menu button classes stay with the two components that also render outside menus.
 *
 * Indirection through other components cannot be seen here; a development console warning
 * covers that case.
 *
 * Pure Node (no ripgrep), so it runs the same on CI runners and dev machines.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src");

/** The menu's own building blocks, which draw the real buttons. */
const MENU_INTERNALS = "shared/components/DataTable/RowActions/";
const TONE_CLASS_ALLOWED = [
  "shared/constants/table/tableActionTone.ts",
  "features/admin-dashboard/utils/shared/adminActionTone.ts",
  "features/admin-dashboard/styles/shared/adminConfirmAction.styles.ts",
  "features/admin-dashboard/components/vendors/VendorKycDocumentsMenuAction.component.tsx",
];

const RAW_BUTTON = /<(?:Button|button)(?=[\s/>]|$)/;
const ACTION_FILE = /(?:RowActions[^/]*|\/return[A-Za-z]*Actions)\.tsx$/;

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
  if (relative.startsWith(MENU_INTERNALS)) continue;

  const isActionFile =
    ACTION_FILE.test(relative) &&
    !relative.endsWith("/TableRowActions.component.tsx");
  let insideMenu = false;

  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (/<TableRowActions(?=[\s>]|$)/.test(line)) insideMenu = true;
      const where = `src/${relative}:${index + 1}`;
      if ((insideMenu || isActionFile) && RAW_BUTTON.test(line)) {
        violations.push(`${where}: use RowActionButton in a row menu`);
      }
      if (
        line.includes("tableMenuButtonClass") &&
        !TONE_CLASS_ALLOWED.includes(relative)
      ) {
        violations.push(`${where}: row menus style their own entries`);
      }
      if (line.includes("</TableRowActions>")) insideMenu = false;
    });
}

if (violations.length > 0) {
  console.error("Row menu entries must be RowActionButtons:\n");
  for (const violation of violations) console.error(`  ${violation}`);
  process.exit(1);
}

console.log("Row menus use the shared action button.");
