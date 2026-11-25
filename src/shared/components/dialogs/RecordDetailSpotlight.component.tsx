"use client";

import type { RecordDetailField } from "@/shared/utils/formatting/recordDetails";

interface RecordDetailSpotlightProps {
  fields: RecordDetailField[];
}

export function RecordDetailSpotlight({ fields }: RecordDetailSpotlightProps) {
  if (fields.length === 0) return null;

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div
          key={field.key}
          className="rounded-xl border-l-2 border-brand bg-paper/55 px-4 py-3 space-y-1"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            {field.label}
          </span>
          <p className="text-body-sm text-ink leading-relaxed whitespace-pre-line break-words">
            {String(field.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
