"use client";

import { useState } from "react";
import { ChevronRight, Terminal } from "lucide-react";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { LABELS } from "@/shared/constants/labels";
import type { RecordDetailField } from "@/shared/utils/formatting/recordDetails";
import { RecordDetailCopyButton } from "./RecordDetailCopyButton.component";

interface RecordDetailSystemSectionProps {
  fields: RecordDetailField[];
}

export function RecordDetailSystemSection({
  fields,
}: RecordDetailSystemSectionProps) {
  const [open, setOpen] = useState(false);

  if (fields.length === 0) return null;

  return (
    <div className="border-t border-line/60 pt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 py-1 text-left text-xs font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          <ChevronRight
            className={`size-3.5 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
            aria-hidden
          />
          <Terminal className="size-3.5 text-ink-muted/70" aria-hidden />
          <span>System & Technical IDs ({fields.length})</span>
        </span>
      </button>

      {open && (
        <dl className="mt-2.5 divide-y divide-line/40 rounded-xl bg-paper/45 px-4 py-1">
          {fields.map((f) => {
            const formatted =
              typeof f.value === "boolean"
                ? f.value
                  ? LABELS.yes
                  : LABELS.no
                : (tryFormatDateTime(f.value) ?? String(f.value));
            const rawStr = String(f.value);
            return (
              <div
                key={f.key}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-2 text-xs"
              >
                <dt className="text-ink-muted font-medium shrink-0">
                  {f.label}
                </dt>
                <dd className="flex items-center gap-1.5 font-mono text-ink break-all min-w-0">
                  <span className="truncate sm:whitespace-normal">
                    {formatted}
                  </span>
                  {rawStr.length > 6 && (
                    <RecordDetailCopyButton value={rawStr} />
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
