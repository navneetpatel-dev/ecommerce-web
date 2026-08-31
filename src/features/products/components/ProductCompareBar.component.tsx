"use client";

import type { ProductListItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { MAX_COMPARED_PRODUCTS } from "../constants/compare";

interface ProductCompareBarProps {
  products: ProductListItem[];
  onToggleProduct: (product: ProductListItem) => void;
  onClear: () => void;
  onCompareNow: () => void;
}

export function ProductCompareBar({
  products,
  onToggleProduct,
  onClear,
  onCompareNow,
}: ProductCompareBarProps) {
  if (products.length === 0) return null;

  const atLimit = products.length >= MAX_COMPARED_PRODUCTS;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-body-sm text-ink-muted" aria-live="polite">
            {formatLabel(LABELS.compareSelectionCount, {
              count: String(products.length),
              max: String(MAX_COMPARED_PRODUCTS),
            })}
          </p>
          {atLimit ? (
            <p className="text-body-sm text-warning" role="status">
              {formatLabel(LABELS.compareMaxReached, {
                max: String(MAX_COMPARED_PRODUCTS),
              })}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            {products.map((product) => (
              <Button
                key={product.id}
                type="button"
                variant="secondary"
                size="sm"
                className="h-auto min-h-0 max-h-none rounded-full bg-brand-subtle px-3 py-1 text-body-sm font-medium text-brand hover:bg-brand-subtle hover:text-brand"
                onClick={() => onToggleProduct(product)}
              >
                {product.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            {LABELS.clear}
          </Button>
          <DisabledActionHint
            disabled={products.length < 2}
            message={LABELS.compareMinRequired}
          >
            <Button
              type="button"
              size="sm"
              disabled={products.length < 2}
              onClick={onCompareNow}
            >
              {LABELS.compareNow}
            </Button>
          </DisabledActionHint>
        </div>
      </div>
    </div>
  );
}
