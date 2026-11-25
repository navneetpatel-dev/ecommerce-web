"use client";

import { useState } from "react";
import { RecordDetailCopyButton } from "./RecordDetailCopyButton.component";

interface RecordDetailIdListProps {
  title: string | null;
  items: string[];
}

/** Hairline-divided copyable list for UUID and ID arrays (e.g. categoryIds). */
export function RecordDetailIdList({ title, items }: RecordDetailIdListProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 18);
  const hiddenCount = items.length - visible.length;

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
            {items.length > 1 && (
              <RecordDetailCopyButton
                value={items.join(", ")}
                label={`Copy all ${title}`}
              />
            )}
          </div>
        </div>
      )}

      <div className="divide-y divide-line/40 rounded-xl bg-paper/45 px-3.5">
        {visible.map((id, idx) => (
          <div
            key={`${id}-${idx}`}
            className="flex items-center justify-between gap-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {items.length > 1 && (
                <span className="text-[11px] font-mono text-ink-muted/70 w-6 shrink-0">
                  #{idx + 1}
                </span>
              )}
              <span className="font-mono text-ink break-all">{id}</span>
            </div>
            <RecordDetailCopyButton value={id} label={`Copy ${id}`} />
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-body-xs font-semibold text-brand hover:bg-brand/20 transition-colors cursor-pointer"
        >
          +{hiddenCount} more
        </button>
      )}
    </section>
  );
}
