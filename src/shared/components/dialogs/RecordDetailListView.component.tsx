"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { RecordDetailImage } from "@/shared/components/dialogs/RecordDetailImage.component";
import { UUID_REGEX } from "@/shared/utils/formatting/recordDetailConstants";
import { fieldLabel } from "@/shared/utils/formatting/recordDetails";
import { extractImageUrls } from "@/shared/utils/media/imageField";
import { RecordDetailIdList } from "./RecordDetailIdList.component";
import { RecordDetailObjectView } from "./RecordDetailObjectView.component";
import { RecordDetailPermissionList } from "./RecordDetailPermissionList.component";
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
  const [showAllTags, setShowAllTags] = useState(false);

  if (!Array.isArray(items) || items.length === 0) {
    return <span className="text-ink-faint">—</span>;
  }

  const title = fieldKey ? fieldLabel(fieldKey) : null;

  const allStrings = items.every((it) => typeof it === "string");
  if (allStrings) {
    const urls = extractImageUrls(items);
    if (urls.length === items.length) {
      return (
        <RecordDetailImage
          value={items}
          alt={title ?? "Images"}
          fieldKey={fieldKey}
        />
      );
    }
    const strItems = items as string[];
    const isPermissionArray =
      fieldKey === "permissionKeys" ||
      ((fieldKey?.toLowerCase().includes("permission") ?? false) &&
        strItems.every((s) => s.includes(".")));
    if (isPermissionArray) {
      return <RecordDetailPermissionList title={title} items={strItems} />;
    }

    const isIdArray =
      (fieldKey
        ? /(?:^|_|-)(?:id|ids)$/i.test(fieldKey) ||
          fieldKey.endsWith("Ids") ||
          fieldKey.endsWith("Id")
        : false) || strItems.every((s) => UUID_REGEX.test(s.trim()));
    if (isIdArray) {
      return <RecordDetailIdList title={title} items={strItems} />;
    }

    const visibleTags = showAllTags ? items : items.slice(0, 18);
    const hiddenCount = items.length - visibleTags.length;
    return (
      <section className="space-y-2.5">
        {title && (
          <div className="flex items-center justify-between pb-2 border-b border-line/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {title}
            </span>
            <span className="text-[11px] font-mono text-ink-muted/80">
              {items.length}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map((val, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full bg-paper/80 px-2.5 py-0.5 text-body-xs font-medium text-ink border border-line/60"
            >
              {String(val)}
            </span>
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTags(true)}
              className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-body-xs font-semibold text-brand hover:bg-brand/20 transition-colors cursor-pointer"
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      </section>
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
    <section
      className={
        nestedLevel === 0
          ? "space-y-2.5 w-full"
          : "rounded-xl bg-paper/45 px-3.5 py-2.5 space-y-2 w-full"
      }
    >
      {title && (
        <div className="flex items-center justify-between pb-2 border-b border-line/60">
          <div className="flex items-center gap-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">
            <Package className="size-3.5 text-brand" aria-hidden />
            <span>{title}</span>
          </div>
          <span className="text-[11px] font-mono text-ink-muted/80">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}
      <div className="divide-y divide-line/50 rounded-xl bg-paper/40 px-4">
        {items.map((item, idx) => {
          if (!item || typeof item !== "object") {
            return (
              <span key={idx} className="text-body-xs text-ink block py-2.5">
                {String(item)}
              </span>
            );
          }
          const obj = item as Record<string, unknown>;

          return (
            <div key={idx} className="py-3">
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
    </section>
  );
}
