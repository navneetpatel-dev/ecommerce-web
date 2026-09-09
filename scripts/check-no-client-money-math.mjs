#!/usr/bin/env node
/**
 * Guardrail: the frontend displays money, it never calculates it.
 *
 * Every monetary figure must arrive from the API already computed by the backend
 * pricing engine (backend/src/modules/pricing). This catches arithmetic on
 * money-named identifiers, which would reintroduce a second source of truth.
 * Formatting — grouping, the ₹ prefix, compact notation — is display, not
 * calculation, and is allowlisted below.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const searchDirs = [
  path.join(root, "src", "features"),
  path.join(root, "src", "shared"),
];

/**
 * Each entry needs a reason. Keeping this list short is the point — every
 * exception should be a deliberate decision, not a place to hide new math.
 */
const allowlist = [
  // Pure display formatters: grouping and compact notation over a final amount.
  "src/shared/utils/orderFormat.ts",
  "src/shared/utils/formatPoints.ts",
  // Chart geometry: axis domain padding and tick labels over an already-final series.
  "src/features/admin-dashboard/components/AnalyticsTrendChart.component.tsx",
  // `total` here is a page/row count, not money.
  "src/shared/api/pagination.ts",
  "src/features/admin-dashboard/components/AnalyticsStatusChart.component.tsx",
  "src/features/admin-dashboard/hooks/useAdminDataList.hook.ts",
  // Single pure helper: wishlist price-at-add vs. live product price, used
  // only to decide whether to show the "Price dropped" badge.
  "src/features/wishlist/utils/priceDrop.utils.ts",
  // Cash deposit discrepancy threshold check (amount vs expectedAmount)
  "src/features/admin-dashboard/components/CashDepositsPanel/CashDepositTableRow.component.tsx",
  "src/features/delivery-dashboard/components/CashDepositsCard.component.tsx",
  "src/features/delivery-dashboard/components/CashDepositsCard/useCashDepositsCardPresentation.hook.ts",
  // Client-side summation of pending payout items for summary display
  "src/features/delivery-dashboard/components/EarningsPayoutsCard.component.tsx",
  "src/features/delivery-dashboard/components/EarningsPayoutsCard/useEarningsPayoutsCardPresentation.hook.ts",
  // `total` here is pagination item count, not money
  "src/features/vendor-dashboard/components/ProductsTableView.component.tsx",
];

/** constants/ holds display strings and route paths — no logic, only false positives. */
const excludeGlobs = ["!**/__tests__/**", "!**/constants/**"];

/**
 * A money identifier is camelCase (or lowercase) ENDING in a money word, so
 * `saleAmount` and `revenue` match while `totalPages` and `itemCount` do not.
 */
const MONEY_WORD = [
  "[Pp]rice",
  "[Aa]mount",
  "[Tt]otal",
  "[Ss]ubtotal",
  "[Rr]evenue",
  "[Dd]iscount",
  "[Rr]efund",
  "[Pp]ayout",
  "[Cc]ommission",
  "[Ee]arnings?",
  "[Bb]alance",
  "[Cc]ashback",
  "[Gg]mv",
  "[Ff]ee",
  "[Cc]harge",
].join("|");
const MONEY_IDENT = String.raw`\b[a-z_$][A-Za-z0-9_$]*(?:${MONEY_WORD})\b`;

/**
 * Operators must be space-padded on both sides. Prettier (enforced via
 * lint-staged) always formats binary operators that way, so this costs no
 * coverage while excluding kebab-case strings, URLs and import paths.
 */
const OPERATOR = String.raw`[A-Za-z0-9_$)\]]\s[-+*/]\s`;
const patterns = [
  // Money identifier, then arithmetic later on the line.
  // Catches `Number(order.totalAmount) - walletUsed` as well as `subtotal * qty`.
  String.raw`${MONEY_IDENT}.*${OPERATOR}`,
  // Arithmetic, then a money identifier later on the line: `qty * unitPrice`.
  String.raw`${OPERATOR}.*${MONEY_IDENT}`,
  // `items.reduce((sum, i) => sum + i.revenue, 0)`
  String.raw`reduce\([^)]*${MONEY_IDENT}`,
];

function runRipgrep(pattern) {
  try {
    return execFileSync(
      "rg",
      [
        "--no-heading",
        "--line-number",
        ...excludeGlobs.flatMap((glob) => ["--glob", glob]),
        "-e",
        pattern,
        ...searchDirs,
      ],
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
  .map((line) => {
    const firstColon = line.indexOf(":");
    const file = line.slice(0, firstColon);
    return {
      rel: path.relative(root, path.resolve(root, file)),
      text: `${path.relative(root, path.resolve(root, file))}${line.slice(firstColon)}`,
    };
  })
  .filter(({ rel }) => !allowlist.some((allowed) => rel.endsWith(allowed)));

if (violations.length > 0) {
  console.error(
    "Client-side money arithmetic in src/ (money is computed by the backend and only displayed here):\n",
  );
  for (const text of [...new Set(violations.map((v) => v.text))].sort()) {
    console.error(`  ${text}`);
  }
  console.error(
    "\nIf a value genuinely cannot come from the API, add the file to the allowlist\n" +
      "in scripts/check-no-client-money-math.mjs with a reason.",
  );
  process.exit(1);
}
