import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { ProductVariant } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface SpecRow {
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specs?: Record<string, string> | null;
  matchedVariant?: ProductVariant | null;
  categoryName?: string | null;
  secondaryCategories?: Array<{ id: string; name: string; slug: string }>;
  displayStock: number;
}

function formatWeightGrams(grams?: number) {
  if (!grams || grams <= 0) return null;
  return formatLabel(LABELS.productWeightGrams, {
    grams: formatInrAmount(grams),
  });
}

function pushUniqueRow(
  rows: SpecRow[],
  seen: Set<string>,
  label: string,
  value: string,
) {
  const normalized = label.trim().toLowerCase();
  if (!value || seen.has(normalized)) return;
  seen.add(normalized);
  rows.push({ label, value });
}

export function ProductSpecifications({
  specs,
  matchedVariant,
  categoryName,
  secondaryCategories,
  displayStock,
}: ProductSpecificationsProps) {
  const rows: SpecRow[] = [];
  const seenLabels = new Set<string>();

  if (matchedVariant?.sku) {
    pushUniqueRow(rows, seenLabels, LABELS.sku, matchedVariant.sku);
  }

  if (matchedVariant?.price != null) {
    pushUniqueRow(
      rows,
      seenLabels,
      LABELS.variantPrice,
      `₹${formatInrAmount(Number(matchedVariant.price))}`,
    );
  }

  if (matchedVariant?.attributes) {
    for (const [key, value] of Object.entries(matchedVariant.attributes)) {
      pushUniqueRow(rows, seenLabels, key, value);
    }
  }

  const weight = formatWeightGrams(matchedVariant?.weightGrams);
  if (weight) {
    pushUniqueRow(rows, seenLabels, LABELS.productWeight, weight);
  }

  if (categoryName) {
    pushUniqueRow(rows, seenLabels, LABELS.categoryLabel, categoryName);
  }

  if (specs) {
    for (const [key, value] of Object.entries(specs)) {
      pushUniqueRow(rows, seenLabels, key, value);
    }
  }

  pushUniqueRow(
    rows,
    seenLabels,
    LABELS.stock,
    displayStock > 0
      ? formatLabel(LABELS.stockAvailable, { count: displayStock })
      : LABELS.outOfStock,
  );

  if (!rows.length) return null;

  return (
    <div className="space-y-6">
      <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {rows.map((row, index) => (
          <div
            key={`${index}-${row.label}`}
            className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3 sm:grid-cols-[10rem_1fr]"
          >
            <dt className="text-body-sm font-medium text-ink-muted">
              {row.label}
            </dt>
            <dd className="text-body text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      {secondaryCategories?.length ? (
        <div className="space-y-2">
          <p className="text-body-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">
            {LABELS.alsoInCategories}
          </p>
          <div className="flex flex-wrap gap-2">
            {secondaryCategories.map((category) => (
              <Link
                key={category.id}
                href={PATHS.category(category.slug)}
                className="rounded-full border border-line bg-paper px-3 py-1 text-body-sm text-ink-muted transition-colors hover:border-brand hover:text-brand"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
