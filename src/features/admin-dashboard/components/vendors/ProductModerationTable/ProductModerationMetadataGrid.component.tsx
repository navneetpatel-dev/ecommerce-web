"use client";

import { PlatformListedBadge } from "@/features/products";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ProductDetail } from "@/shared/api/types";

interface ProductModerationMetadataGridProps {
  product: ProductDetail;
  loading?: boolean;
}

export function ProductModerationMetadataGrid({
  product,
  loading = false,
}: ProductModerationMetadataGridProps) {
  const vendorName = product.vendor?.businessName || "—";
  const categoryName = product.category?.name || product.categoryName || "—";
  const hsn = product.displayHsnCode || product.hsnCode || "—";
  const gst = product.gstPercentage != null ? `${product.gstPercentage}%` : "—";
  const mrp =
    product.compareAtPrice != null ? formatInr(product.compareAtPrice) : "—";
  const totalStock = Array.isArray(product.variants)
    ? product.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0)
    : "—";

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-md border border-line/60 bg-paper/40 p-3 text-body-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-md border border-line/60 bg-paper/40 p-3 text-body-sm">
      <div>
        <span className="font-medium text-ink-muted">
          {LABELS.productPreviewVendor}:
        </span>{" "}
        <span className="font-semibold text-ink block truncate">
          {vendorName}
        </span>
      </div>
      <div>
        <span className="font-medium text-ink-muted">
          {LABELS.productPreviewCategory}:
        </span>{" "}
        <span className="font-semibold text-ink block truncate">
          {categoryName}
        </span>
      </div>
      <div>
        <span className="font-medium text-ink-muted">
          {LABELS.productPreviewPricing}:
        </span>{" "}
        <span className="font-semibold text-ink block">
          {formatInr(product.basePrice)}
        </span>
      </div>
      <div>
        <span className="font-medium text-ink-muted">
          {LABELS.listPrice} (MRP):
        </span>{" "}
        <span className="font-semibold text-ink block">{mrp}</span>
      </div>
      <div>
        <span className="font-medium text-ink-muted">
          {LABELS.gstPercentage}:
        </span>{" "}
        <span className="font-semibold text-ink block">{gst}</span>
      </div>
      <div>
        <span className="font-medium text-ink-muted">
          {LABELS.hsnOptional}:
        </span>{" "}
        <span className="font-semibold text-ink block">{hsn}</span>
      </div>
      <div>
        <span className="font-medium text-ink-muted">{LABELS.stock}:</span>{" "}
        <span className="font-semibold text-ink block">{totalStock}</span>
      </div>
      {Array.isArray(product.variants) && product.variants.length > 0 && (
        <div>
          <span className="font-medium text-ink-muted">{LABELS.variants}:</span>{" "}
          <span className="font-semibold text-ink block">
            {product.variants.length} variant
            {product.variants.length === 1 ? "" : "s"}
          </span>
        </div>
      )}
      {product.listedByPlatform ? (
        <div className="col-span-2 sm:col-span-3">
          <PlatformListedBadge />{" "}
          <span className="font-medium text-ink-muted">
            {LABELS.vendorConsentNoteLabel}:
          </span>{" "}
          <span className="font-semibold text-ink">
            {product.vendorConsentNote || "—"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
