"use client";

import { FolderTree, ExternalLink, ChevronRight } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";
import { ProductCategoryMetrics } from "./ProductCategoryMetrics.component";
import type { CategoryModalTarget } from "./CategoryDetailModal.component";

interface ProductCategoryCardProps {
  product: Record<string, unknown>;
  onCategoryClick?: (target: CategoryModalTarget) => void;
}

export function ProductCategoryCard({
  product,
  onCategoryClick,
}: ProductCategoryCardProps) {
  const category = (product.category as Record<string, unknown>) ?? null;
  const categoryName = (
    typeof category?.name === "string" ? category.name : product.categoryName
  ) as string | null;
  const categorySlug = (
    typeof category?.slug === "string" ? category.slug : product.categorySlug
  ) as string | null;
  const categoryId = (
    typeof category?.id === "string" ? category.id : product.categoryId
  ) as string | null;
  const categoryStatus =
    typeof category?.status === "string" ? category.status : null;
  const description =
    typeof category?.description === "string" ? category.description : null;
  const parent = (category?.parent as Record<string, unknown>) ?? null;
  const parentId = typeof parent?.id === "string" ? parent.id : null;
  const parentName = typeof parent?.name === "string" ? parent.name : null;
  const parentSlug = typeof parent?.slug === "string" ? parent.slug : null;
  const secondaryCategories = Array.isArray(product.secondaryCategories)
    ? (product.secondaryCategories as Array<{
        id?: string;
        name?: string;
        slug?: string;
      }>)
    : [];

  if (!categoryName && secondaryCategories.length === 0) return null;

  const openCategory = (target: CategoryModalTarget) => {
    if (onCategoryClick) {
      onCategoryClick(target);
      return;
    }
    const url = target.id
      ? `${PATHS.admin.products}?tab=all&categoryId=${target.id}`
      : `${PATHS.admin.products}?tab=all&search=${encodeURIComponent(target.name ?? "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line/60 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <FolderTree className="size-4 text-brand" aria-hidden />
          <span>Category & Taxonomy Details</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categoryStatus && <StatusBadge status={categoryStatus} />}
          {categoryId && (
            <a
              href={`${PATHS.admin.products}?tab=all&categoryId=${categoryId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
            >
              <span>Filter Products</span>
              <ExternalLink className="size-3" />
            </a>
          )}
          <a
            href={PATHS.admin.categories}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
          >
            <span>All Categories</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-line/60 bg-paper/60 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {parentName && (
            <div className="inline-flex items-center gap-1 text-xs text-ink-muted">
              <button
                type="button"
                onClick={() =>
                  openCategory({
                    id: parentId,
                    name: parentName,
                    slug: parentSlug,
                    preview: parent,
                  })
                }
                className="hover:text-brand hover:underline cursor-pointer"
              >
                {parentName}
              </button>
              <ChevronRight className="size-3 text-ink-muted/60" />
            </div>
          )}
          <button
            type="button"
            onClick={() =>
              openCategory({
                id: categoryId,
                name: categoryName,
                slug: categorySlug,
                preview: category,
              })
            }
            className="font-bold text-base text-ink hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{categoryName}</span>
          </button>
        </div>
        {categorySlug && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
            <span>slug: {categorySlug}</span>
            <RecordDetailCopyButton
              value={categorySlug}
              label="Copy category slug"
            />
          </div>
        )}
        {description && (
          <p className="text-xs text-ink-muted pt-1 leading-relaxed border-t border-line/40">
            {description}
          </p>
        )}
      </div>

      <ProductCategoryMetrics
        category={category}
        secondaryCategories={secondaryCategories}
        onSelectCategory={openCategory}
      />
    </div>
  );
}
