"use client";

import { ExternalLink, Star, Tag } from "lucide-react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";
import { ProductHeroPriceBadge } from "./ProductHeroPriceBadge.component";

interface ProductHeroCardProps {
  product: Record<string, unknown>;
}

function resolveHeroImage(product: Record<string, unknown>): string | null {
  if (typeof product.imageUrl === "string" && product.imageUrl.trim()) {
    return product.imageUrl.trim();
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === "string") return first;
    if (typeof first?.url === "string") return first.url;
  }
  return null;
}

export function ProductHeroCard({ product }: ProductHeroCardProps) {
  const imageUrl = resolveHeroImage(product);
  const name = String(product.name ?? product.productName ?? "Product Details");
  const brand = typeof product.brand === "string" ? product.brand : null;
  const category = (product.category as Record<string, unknown>) ?? null;
  const categoryName =
    typeof product.categoryName === "string"
      ? product.categoryName
      : typeof category?.name === "string"
        ? String(category.name)
        : null;

  const categorySlug =
    typeof category?.slug === "string"
      ? category.slug
      : typeof product.categorySlug === "string"
        ? product.categorySlug
        : null;

  const displayPrice =
    product.displayPrice ?? product.basePrice ?? product.price;
  const compareAtPrice = product.compareAtPrice ?? product.mrp;
  const discountPercent = product.discountPercent;
  const stock = typeof product.stock === "number" ? product.stock : null;
  const avgRating =
    typeof product.avgRating === "number" ? product.avgRating : null;
  const reviewCount =
    typeof product.reviewCount === "number" ? product.reviewCount : 0;
  const status = typeof product.status === "string" ? product.status : null;
  const slug = typeof product.slug === "string" ? product.slug : null;
  const storeUrl = slug
    ? PATHS.product(slug)
    : `${PATHS.products}?search=${encodeURIComponent(name)}`;

  return (
    <div className="rounded-2xl border border-line/80 bg-gradient-to-b from-surface-subtle/60 to-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open product on storefront in new tab"
          className="group relative size-20 sm:size-24 rounded-xl overflow-hidden border border-line bg-paper shrink-0 shadow-xs hover:border-brand/40 transition-colors"
        >
          <MediaImage
            src={imageUrl}
            alt={name}
            sizes="96px"
            imageClassName="object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <ExternalLink className="size-4 drop-shadow" />
          </div>
        </a>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {status && <StatusBadge status={status} />}
            {brand && (
              <a
                href={`${PATHS.products}?brand=${encodeURIComponent(brand)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View brand products in new tab"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand text-[11px] font-semibold border border-brand/30 hover:bg-brand hover:text-paper hover:border-brand transition-all"
              >
                <span>{brand}</span>
                <ExternalLink className="size-2.5 opacity-70" />
              </a>
            )}
            {categoryName && (
              <a
                href={
                  categorySlug ? PATHS.category(categorySlug) : PATHS.categories
                }
                target="_blank"
                rel="noopener noreferrer"
                title="View category in new tab"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface text-ink-muted text-[11px] font-medium border border-line hover:bg-brand-subtle hover:text-ink hover:border-brand/40 transition-all"
              >
                <Tag className="size-3" />
                <span>{categoryName}</span>
                <ExternalLink className="size-2.5 opacity-70" />
              </a>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight line-clamp-2">
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open product on storefront in new tab"
              className="hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{name}</span>
              <ExternalLink className="size-4 opacity-60 inline shrink-0" />
            </a>
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
            {avgRating != null && avgRating > 0 && (
              <a
                href={
                  slug
                    ? PATHS.productReviews(slug)
                    : `${PATHS.admin.reviews}?search=${encodeURIComponent(name)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                title="View reviews in new tab"
                className="flex items-center gap-1 font-semibold text-ink hover:text-brand transition-colors"
              >
                <Star className="size-3.5 fill-amber-400 text-amber-500" />
                <span>{avgRating.toFixed(1)}</span>
                <span className="text-ink-muted font-normal">
                  ({reviewCount} reviews)
                </span>
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
            )}
            {slug && (
              <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                <span className="text-ink-muted">slug:</span>
                <span className="text-ink font-medium">{slug}</span>
                <RecordDetailCopyButton value={slug} label="Copy slug" />
              </div>
            )}
          </div>
        </div>

        <ProductHeroPriceBadge
          displayPrice={displayPrice}
          compareAtPrice={compareAtPrice}
          discountPercent={discountPercent}
          stock={stock}
        />
      </div>

      <div className="pt-2 border-t border-line/60 flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="text-ink-muted">
          Click title, image, brand, or vendor to open full view in new tab
        </span>
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong/80 bg-surface text-ink font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
        >
          <ExternalLink className="size-3.5 text-brand" />
          <span>View on Storefront</span>
        </a>
      </div>
    </div>
  );
}
