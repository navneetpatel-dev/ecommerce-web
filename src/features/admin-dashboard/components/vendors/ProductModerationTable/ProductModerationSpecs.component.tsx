"use client";

import { LABELS } from "@/shared/constants/labels";

interface ProductModerationSpecsProps {
  specs: unknown;
}

export function ProductModerationSpecs({ specs }: ProductModerationSpecsProps) {
  if (!specs) return null;

  const entries: Array<[string, string]> = [];
  if (Array.isArray(specs)) {
    for (const item of specs) {
      if (item && typeof item === "object") {
        const itemObj = item as Record<string, unknown>;
        const k =
          "key" in itemObj
            ? String(itemObj.key ?? "")
            : "name" in itemObj
              ? String(itemObj.name ?? "")
              : "";
        const v = "value" in itemObj ? String(itemObj.value ?? "") : "";
        if (k) entries.push([k, v]);
      }
    }
  } else if (typeof specs === "object") {
    for (const [key, val] of Object.entries(specs as Record<string, unknown>)) {
      entries.push([key, String(val ?? "")]);
    }
  }

  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-body-sm font-semibold text-ink">
        {LABELS.productPreviewSpecifications}
      </h4>
      <dl className="grid grid-cols-2 gap-2 text-body-xs">
        {entries.map(([key, val]) => (
          <div key={key} className="rounded border border-line/40 p-2">
            <dt className="text-ink-muted">{key}</dt>
            <dd className="font-medium text-ink">{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
