"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { fieldLabel } from "@/shared/utils/formatting/recordDetails";
import { RecordDetailCopyButton } from "./RecordDetailCopyButton.component";

interface RecordDetailPermissionListProps {
  title: string | null;
  items: string[];
}

interface PermissionGroup {
  resource: string;
  label: string;
  entries: Array<{ full: string; action: string }>;
}

function actionBadgeTone(action: string): string {
  const lower = action.toLowerCase();
  if (lower === "view" || lower === "read" || lower === "list") {
    return "bg-surface-muted/80 text-ink-muted border-line/60";
  }
  if (lower === "create" || lower === "approve" || lower === "publish") {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  }
  if (lower === "delete" || lower === "revoke" || lower === "suspend") {
    return "bg-danger/10 text-danger border-danger/25";
  }
  return "bg-brand/10 text-brand border-brand/25";
}

function groupPermissionKeys(items: string[]): PermissionGroup[] {
  const map = new Map<string, PermissionGroup>();
  for (const key of items) {
    const dotIdx = key.indexOf(".");
    const resource = dotIdx > 0 ? key.slice(0, dotIdx) : "general";
    const action = dotIdx > 0 ? key.slice(dotIdx + 1) : key;
    const existing = map.get(resource);
    if (existing) {
      existing.entries.push({ full: key, action });
    } else {
      map.set(resource, {
        resource,
        label: fieldLabel(resource),
        entries: [{ full: key, action }],
      });
    }
  }
  return [...map.values()];
}

/** Hairline-divided resource matrix for permission keys (e.g. product.manage). */
export function RecordDetailPermissionList({
  title,
  items,
}: RecordDetailPermissionListProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const groups = useMemo(() => groupPermissionKeys(items), [items]);

  const handleCopyOne = (fullKey: string) => {
    try {
      void navigator.clipboard.writeText(fullKey);
      setCopiedKey(fullKey);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === fullKey ? null : prev));
      }, 1500);
    } catch {
      // Ignore clipboard errors in unsupported environments
    }
  };

  return (
    <section className="space-y-2.5">
      {title && (
        <div className="flex items-center justify-between pb-2 border-b border-line/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-ink-muted/80">
              {items.length}
            </span>
            <RecordDetailCopyButton
              value={items.join(", ")}
              label={`Copy all ${title}`}
            />
          </div>
        </div>
      )}

      <div className="divide-y divide-line/40 rounded-xl bg-paper/45 px-4 py-1">
        {groups.map((group) => (
          <div
            key={group.resource}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2.5"
          >
            <span className="text-xs font-semibold text-ink-muted sm:w-32 shrink-0">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {group.entries.map((entry) => {
                const isCopied = copiedKey === entry.full;
                return (
                  <button
                    key={entry.full}
                    type="button"
                    onClick={() => handleCopyOne(entry.full)}
                    title={isCopied ? "Copied!" : `Copy ${entry.full}`}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-body-xs font-medium transition-opacity hover:opacity-85 cursor-pointer",
                      actionBadgeTone(entry.action),
                    )}
                  >
                    {isCopied && (
                      <Check className="size-3 shrink-0" strokeWidth={2.5} />
                    )}
                    <span>{entry.action}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
