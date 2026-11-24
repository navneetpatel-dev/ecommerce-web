"use client";

import { Store, FolderTree, ExternalLink } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";

interface ProductVendorCardProps {
  product: Record<string, unknown>;
}

export function ProductVendorCard({ product }: ProductVendorCardProps) {
  const vendor = (product.vendor as Record<string, unknown>) ?? null;
  const vendorId =
    typeof vendor?.id === "string"
      ? vendor.id
      : typeof product.vendorId === "string"
        ? product.vendorId
        : null;

  const vendorName =
    typeof vendor?.businessName === "string"
      ? vendor.businessName
      : typeof product.vendorName === "string"
        ? product.vendorName
        : null;

  const vendorSlug = typeof vendor?.slug === "string" ? vendor.slug : null;

  const category = (product.category as Record<string, unknown>) ?? null;
  const categoryName =
    typeof category?.name === "string"
      ? category.name
      : typeof product.categoryName === "string"
        ? product.categoryName
        : null;

  const categorySlug =
    typeof category?.slug === "string"
      ? category.slug
      : typeof product.categorySlug === "string"
        ? product.categorySlug
        : null;

  const secondaryCategories = Array.isArray(product.secondaryCategories)
    ? (product.secondaryCategories as Array<{ name?: string; slug?: string }>)
    : [];

  if (!vendorName && !categoryName && secondaryCategories.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vendorName && (
          <div className="p-4 rounded-xl border border-line/60 bg-paper/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink font-semibold text-xs uppercase tracking-wider">
                <Store className="size-4 text-brand" aria-hidden />
                <span>Seller / Vendor</span>
              </div>
              {vendorId && (
                <a
                  href={`/admin/vendors/${vendorId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View vendor management page in admin in new tab"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
                >
                  <span>Admin Profile</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            <div>
              {vendorSlug ? (
                <a
                  href={PATHS.vendorPage(vendorSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open vendor storefront in new tab"
                  className="font-bold text-sm text-ink hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{vendorName}</span>
                  <ExternalLink className="size-3.5 opacity-60" />
                </a>
              ) : (
                <p className="font-bold text-sm text-ink">{vendorName}</p>
              )}
            </div>

            {vendorSlug && (
              <div className="flex items-center gap-1 font-mono text-[11px] text-ink-muted">
                <span>@{vendorSlug}</span>
                <RecordDetailCopyButton
                  value={vendorSlug}
                  label="Copy seller slug"
                />
              </div>
            )}
          </div>
        )}

        {categoryName && (
          <div className="p-4 rounded-xl border border-line/60 bg-paper/60 space-y-2">
            <div className="flex items-center gap-2 text-ink font-semibold text-xs uppercase tracking-wider">
              <FolderTree className="size-4 text-brand" aria-hidden />
              <span>Category & Taxonomy</span>
            </div>

            <div>
              <a
                href={
                  categorySlug ? PATHS.category(categorySlug) : PATHS.categories
                }
                target="_blank"
                rel="noopener noreferrer"
                title="Open category page in new tab"
                className="font-bold text-sm text-ink hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{categoryName}</span>
                <ExternalLink className="size-3.5 opacity-60" />
              </a>
            </div>

            {secondaryCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {secondaryCategories.map((sc, i) => (
                  <a
                    key={i}
                    href={sc.slug ? PATHS.category(sc.slug) : PATHS.categories}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${sc.name ?? sc.slug} in new tab`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface text-[10px] text-ink-muted border border-line hover:border-brand/40 hover:text-brand transition-colors"
                  >
                    <span>{sc.name ?? sc.slug}</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
