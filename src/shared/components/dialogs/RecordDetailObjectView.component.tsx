"use client";

import type { ReactNode } from "react";
import { Database, Layers, MapPin, Sliders, User } from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { RecordDetailImage } from "@/shared/components/dialogs/RecordDetailImage.component";
import { formatReasonLabel } from "@/shared/utils/formatting/formatStatus";
import { LABELS } from "@/shared/constants/labels";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import {
  fieldLabel,
  isMoneyKey,
} from "@/shared/utils/formatting/recordDetails";
import {
  extractImageUrls,
  isImageFieldKey,
} from "@/shared/utils/media/imageField";
import { SKIP_DETAIL_KEYS } from "@/shared/utils/formatting/recordDetailConstants";

interface RecordDetailObjectViewProps {
  value: Record<string, unknown>;
  fieldKey?: string;
  nestedLevel?: number;
}

function resolveObjectIcon(key?: string) {
  if (!key) return <Layers className="size-4" aria-hidden />;
  const lower = key.toLowerCase();
  if (
    lower.includes("address") ||
    lower.includes("location") ||
    lower.includes("city")
  ) {
    return <MapPin className="size-4" aria-hidden />;
  }
  if (
    lower.includes("user") ||
    lower.includes("actor") ||
    lower.includes("customer")
  ) {
    return <User className="size-4" aria-hidden />;
  }
  if (
    lower.includes("meta") ||
    lower.includes("raw") ||
    lower.includes("json")
  ) {
    return <Database className="size-4" aria-hidden />;
  }
  if (
    lower.includes("config") ||
    lower.includes("setting") ||
    lower.includes("pref")
  ) {
    return <Sliders className="size-4" aria-hidden />;
  }
  return <Layers className="size-4" aria-hidden />;
}

export function formatObjectFieldValue(
  key: string,
  val: unknown,
  nestedLevel: number,
): ReactNode {
  if (val == null || val === "")
    return <span className="text-ink-faint">—</span>;

  if (isImageFieldKey(key)) {
    const urls = extractImageUrls(val);
    if (urls.length > 0)
      return <RecordDetailImage value={val} alt={fieldLabel(key)} />;
    return <span className="text-ink-faint">—</span>;
  }
  if (typeof val === "boolean") {
    return (
      <span className="font-semibold text-caption">
        {val ? LABELS.yes : LABELS.no}
      </span>
    );
  }
  if (key === "status" || key.endsWith("Status") || key === "paymentStatus") {
    if (typeof val === "string" && val.trim())
      return <StatusBadge status={val} />;
  }
  if (key === "reasonCode" || key.endsWith("ReasonCode")) {
    if (typeof val === "string" && val.trim())
      return <span>{formatReasonLabel(val)}</span>;
  }
  if (isMoneyKey(key)) {
    const num = Number(val);
    if (!isNaN(num))
      return (
        <span className="font-mono tabular-nums font-semibold">
          {formatInr(num)}
        </span>
      );
  }
  const asDate = tryFormatDateTime(val);
  if (asDate) return <span>{asDate}</span>;

  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="text-ink-faint">—</span>;
    if (val.every((v) => typeof v === "string" || typeof v === "number")) {
      return <span>{val.join(", ")}</span>;
    }
    return <span>{val.length} items</span>;
  }
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (Object.keys(obj).length === 0)
      return <span className="text-ink-faint">—</span>;
    if (nestedLevel < 2) {
      return (
        <RecordDetailObjectView
          value={obj}
          fieldKey={key}
          nestedLevel={nestedLevel + 1}
        />
      );
    }
    const label = obj.name ?? obj.title ?? obj.businessName;
    return typeof label === "string"
      ? label
      : `${Object.keys(obj).length} fields`;
  }
  return String(val);
}

export function RecordDetailObjectView({
  value,
  fieldKey,
  nestedLevel = 0,
}: RecordDetailObjectViewProps) {
  if (!value || typeof value !== "object")
    return <span className="text-ink-faint">—</span>;

  const entries = Object.entries(value).filter(
    ([k]) => !SKIP_DETAIL_KEYS.has(k) && !k.endsWith("Id"),
  );

  if (entries.length === 0) return <span className="text-ink-faint">—</span>;

  const title = fieldKey ? fieldLabel(fieldKey) : null;
  const icon = resolveObjectIcon(fieldKey);

  return (
    <div className="rounded-xl border border-line/70 bg-surface-subtle/40 p-4 shadow-sm space-y-3 w-full">
      {title && (
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-line/60">
          <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
            <span className="text-brand">{icon}</span>
            <span>{title}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-paper border border-line/70 text-ink-muted">
            {entries.length} {entries.length === 1 ? "field" : "fields"}
          </span>
        </div>
      )}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {entries.map(([k, val]) => (
          <div
            key={k}
            className="flex flex-col gap-0.5 rounded-lg border border-line/50 bg-paper/70 p-2.5"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted/80 truncate">
              {fieldLabel(k)}
            </dt>
            <dd className="text-body-xs font-medium text-ink break-words">
              {formatObjectFieldValue(k, val, nestedLevel)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
