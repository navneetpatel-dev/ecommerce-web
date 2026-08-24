"use client";

import type { ProductListItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";

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

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            {LABELS.clear}
          </Button>
          <DisabledActionHint
            disabled={products.length < 2}
            message="Add at least 2 products to compare."
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
