"use client";

import { Package } from "lucide-react";
import { RecordDetailImage } from "@/shared/components/dialogs/RecordDetailImage.component";
import { fieldLabel } from "@/shared/utils/formatting/recordDetails";
import { extractImageUrls } from "@/shared/utils/media/imageField";
import { RecordDetailObjectView } from "./RecordDetailObjectView.component";
import {
  hasItemSummary,
  RecordDetailItemSummary,
} from "./RecordDetailItemSummary.component";

interface RecordDetailListViewProps {
  items: unknown[];
  fieldKey?: string;
  nestedLevel?: number;
}

export function RecordDetailListView({
  items,
  fieldKey,
  nestedLevel = 0,
}: RecordDetailListViewProps) {
  if (!Array.isArray(items) || items.length === 0) {
    return <span className="text-ink-faint">—</span>;
  }

  const title = fieldKey ? fieldLabel(fieldKey) : null;

  const allStrings = items.every((it) => typeof it === "string");
  if (allStrings) {
    const urls = extractImageUrls(items);
    if (urls.length === items.length) {
      return <RecordDetailImage value={items} alt={title ?? "Images"} />;
    }
    return (
      <div className="rounded-xl border border-line/70 bg-surface-subtle/30 p-4 space-y-2.5">
        {title && (
          <div className="flex items-center justify-between pb-1 border-b border-line/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {title}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-paper border border-line/70 text-ink-muted">
              {items.length}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {items.map((val, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-lg bg-paper px-2.5 py-1 text-body-xs font-medium text-ink border border-line shadow-xs"
            >
              {String(val)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const allImageObjects = items.every(
    (it) =>
      it &&
      typeof it === "object" &&
      typeof (it as Record<string, unknown>).url === "string",
  );
  if (allImageObjects) {
    const urls = items.map(
      (it) => (it as Record<string, unknown>).url as string,
    );
    return <RecordDetailImage value={urls} alt={title ?? "Images"} />;
  }

  return (
    <div className="rounded-xl border border-line/70 bg-surface-subtle/30 p-4 space-y-3 w-full">
      {title && (
        <div className="flex items-center justify-between pb-2 border-b border-line/60">
          <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
            <Package className="size-4 text-brand" aria-hidden />
            <span>{title}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-paper border border-line/70 text-ink-muted">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}
      <div className="space-y-2">
        {items.map((item, idx) => {
          if (!item || typeof item !== "object") {
            return (
              <span key={idx} className="text-body-xs text-ink block">
                {String(item)}
              </span>
            );
          }
          const obj = item as Record<string, unknown>;

          return (
            <div
              key={idx}
              className="rounded-xl border border-line/70 bg-paper p-3 shadow-xs hover:border-line transition-colors"
            >
              {hasItemSummary(obj) ? (
                <RecordDetailItemSummary item={obj} />
              ) : (
                <RecordDetailObjectView
                  value={obj}
                  nestedLevel={nestedLevel + 1}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
