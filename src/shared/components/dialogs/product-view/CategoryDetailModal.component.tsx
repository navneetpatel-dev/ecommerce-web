"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ExternalLink, FolderTree } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";
import { ProductCategoryMetrics } from "./ProductCategoryMetrics.component";
import { recordDetailDialogStyles as styles } from "../../../styles/dialogs/dialogComponents.styles";

export interface CategoryModalTarget {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  preview?: Record<string, unknown> | null;
}

interface CategoryDetailModalProps {
  target: CategoryModalTarget | null;
  onClose: () => void;
  onSelectCategory?: (next: CategoryModalTarget) => void;
}

export function CategoryDetailModal({
  target,
  onClose,
  onSelectCategory,
}: CategoryDetailModalProps) {
  const categoryId = target?.id ?? null;
  const [fetched, setFetched] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setFetched(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    apiClient
      .get<Record<string, unknown>>(API.categories.detail(categoryId))
      .then((res) => {
        if (!cancelled) setFetched(res);
      })
      .catch(() => {
        if (!cancelled) setFetched(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const cat = (fetched ?? target?.preview ?? {}) as Record<string, unknown>;
  const name = String(cat.name ?? target?.name ?? "Category Details");
  const slug = typeof cat.slug === "string" ? cat.slug : (target?.slug ?? null);
  const status = typeof cat.status === "string" ? cat.status : null;
  const description =
    typeof cat.description === "string" ? cat.description : null;
  const imageUrl = typeof cat.imageUrl === "string" ? cat.imageUrl : null;
  const parent = (cat.parent as Record<string, unknown>) ?? null;
  const parentId = typeof parent?.id === "string" ? parent.id : null;
  const parentName = typeof parent?.name === "string" ? parent.name : null;

  return (
    <Dialog open={Boolean(target)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={styles.content}>
        <div className={styles.scrollBody}>
          <div className="rounded-2xl border border-line/80 bg-gradient-to-b from-surface-subtle/60 to-surface p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden border border-line bg-paper shrink-0">
                <MediaImage
                  src={imageUrl}
                  alt={name}
                  sizes="80px"
                  imageClassName="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                    <FolderTree className="size-3.5" /> Category
                  </span>
                  {status && <StatusBadge status={status} />}
                  {isLoading && (
                    <span className="text-[11px] text-ink-muted">
                      Refreshing...
                    </span>
                  )}
                </div>
                {parentName && (
                  <div className="flex items-center gap-1 text-xs text-ink-muted">
                    {parentId && onSelectCategory ? (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectCategory({
                            id: parentId,
                            name: parentName,
                            preview: parent,
                          })
                        }
                        className="hover:text-brand hover:underline"
                      >
                        {parentName}
                      </button>
                    ) : (
                      <span>{parentName}</span>
                    )}
                    <ChevronRight className="size-3" />
                  </div>
                )}
                <h2 className="text-lg sm:text-xl font-bold text-ink">
                  {name}
                </h2>
                {slug && (
                  <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
                    <span>slug: {slug}</span>
                    <RecordDetailCopyButton
                      value={slug}
                      label="Copy category slug"
                    />
                  </div>
                )}
              </div>
            </div>
            {description && (
              <p className="text-body-sm text-ink-muted pt-3 border-t border-line/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <ProductCategoryMetrics
            category={cat}
            secondaryCategories={[]}
            onSelectCategory={() => {}}
          />

          <div className="rounded-2xl border border-line/80 bg-surface p-4 shadow-xs flex flex-wrap gap-2">
            {categoryId && (
              <a
                href={`${PATHS.admin.products}?tab=all&categoryId=${categoryId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all"
              >
                <span>Filter Products in Category</span>
                <ExternalLink className="size-3.5" />
              </a>
            )}
            <a
              href={`${PATHS.admin.categories}?search=${encodeURIComponent(name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all"
            >
              <span>Open Categories Manager</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
        <div className={styles.footer}>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {LABELS.done}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
