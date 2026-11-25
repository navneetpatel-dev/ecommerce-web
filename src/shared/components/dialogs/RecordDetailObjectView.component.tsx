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
    <section
      className={
        nestedLevel === 0
          ? "space-y-2 w-full"
          : "rounded-xl bg-paper/45 px-3.5 py-2.5 space-y-2 w-full"
      }
    >
      {title && (
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-line/60">
          <div className="flex items-center gap-2 text-ink-muted font-semibold text-xs uppercase tracking-wider">
            <span className="text-brand">{icon}</span>
            <span>{title}</span>
          </div>
          <span className="text-[11px] font-mono text-ink-muted/80">
            {entries.length} {entries.length === 1 ? "field" : "fields"}
          </span>
        </div>
      )}
      <dl
        className={
          entries.length >= 4
            ? "grid grid-cols-1 md:grid-cols-2 gap-x-8"
            : "flex flex-col"
        }
      >
        {entries.map(([k, val]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 border-b border-line/40 py-2"
          >
            <dt className="text-xs font-medium text-ink-muted shrink-0 max-w-[42%] truncate">
              {fieldLabel(k)}
            </dt>
            <dd className="text-body-xs font-medium text-ink text-right min-w-0 break-words">
              {formatObjectFieldValue(k, val, nestedLevel)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
