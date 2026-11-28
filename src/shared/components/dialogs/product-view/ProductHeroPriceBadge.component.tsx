"use client";

import type { DisplayAmountInput } from "@/shared/utils/formatting/displayAmount";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

interface ProductHeroPriceBadgeProps {
  displayPrice?: unknown;
  compareAtPrice?: unknown;
  discountPercent?: unknown;
  stock?: number | null;
}

export function ProductHeroPriceBadge({
  displayPrice,
  compareAtPrice,
  discountPercent,
  stock,
}: ProductHeroPriceBadgeProps) {
  if (displayPrice == null) return null;

  return (
    <div className="sm:text-right shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-line/60 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-bold font-mono text-ink tracking-tight">
          {formatInr(displayPrice as DisplayAmountInput)}
        </span>
        {compareAtPrice != null &&
          Number(compareAtPrice) > Number(displayPrice) && (
            <span className="text-xs font-mono text-ink-muted line-through">
              {formatInr(compareAtPrice as DisplayAmountInput)}
            </span>
          )}
      </div>

      <div className="flex items-center gap-1.5 mt-1">
        {discountPercent != null && Number(discountPercent) > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-success-subtle text-success border border-success/30 text-[10px] font-bold">
            {Number(discountPercent)}% OFF
          </span>
        )}
        {stock != null && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              stock === 0
                ? "bg-danger-subtle text-danger border border-danger/30"
                : stock <= 5
                  ? "bg-warning-subtle text-warning border border-warning/30"
                  : "bg-success-subtle text-success border border-success/30"
            }`}
          >
            {stock === 0
              ? "Out of Stock"
              : stock <= 5
                ? `Low: ${stock} left`
                : `${stock} in stock`}
          </span>
        )}
      </div>
    </div>
  );
}
