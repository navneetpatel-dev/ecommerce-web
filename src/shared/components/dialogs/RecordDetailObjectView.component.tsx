"use client";

import type { ReactNode } from "react";
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
import { RecordDetailListView } from "./RecordDetailListView.component";

const SKIP_NESTED_KEYS = new Set([
  "id",
  "password",
  "passwordHash",
  "token",
  "refreshToken",
  "accessToken",
  "__typename",
]);

interface RecordDetailObjectViewProps {
  value: Record<string, unknown>;
  nestedLevel?: number;
}

export function formatObjectFieldValue(
  key: string,
  val: unknown,
  nestedLevel: number,
): ReactNode {
  if (val == null || val === "") {
    return <span className="text-ink-faint">—</span>;
  }

  if (isImageFieldKey(key)) {
    const urls = extractImageUrls(val);
    if (urls.length > 0) {
      return <RecordDetailImage value={val} alt={fieldLabel(key)} />;
    }
    return <span className="text-ink-faint">—</span>;
  }

  if (typeof val === "boolean") {
    return val ? LABELS.yes : LABELS.no;
  }

  if (key === "status" || key.endsWith("Status") || key === "paymentStatus") {
    if (typeof val === "string" && val.trim()) {
      return <StatusBadge status={val} />;
    }
  }

  if (key === "reasonCode" || key.endsWith("ReasonCode")) {
    if (typeof val === "string" && val.trim()) {
      return <span>{formatReasonLabel(val)}</span>;
    }
  }

  if (isMoneyKey(key)) {
    if (
      typeof val === "number" ||
      (typeof val === "string" && !isNaN(Number(val)) && val.trim() !== "")
    ) {
      return (
        <span className="font-mono tabular-nums">{formatInr(Number(val))}</span>
      );
    }
  }

  const asDate = tryFormatDateTime(val);
  if (asDate) return asDate;

  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="text-ink-faint">—</span>;
    if (val.every((v) => typeof v === "string" || typeof v === "number")) {
      return <span>{val.join(", ")}</span>;
    }
    if (nestedLevel < 2) {
      return <RecordDetailListView items={val} nestedLevel={nestedLevel + 1} />;
    }
    return <span>{val.length} items</span>;
  }

  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (Object.keys(obj).length === 0) {
      return <span className="text-ink-faint">—</span>;
    }
    if (nestedLevel < 2) {
      return (
        <RecordDetailObjectView value={obj} nestedLevel={nestedLevel + 1} />
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
  nestedLevel = 0,
}: RecordDetailObjectViewProps) {
  if (!value || typeof value !== "object") {
    return <span className="text-ink-faint">—</span>;
  }

  const entries = Object.entries(value).filter(
    ([k]) => !SKIP_NESTED_KEYS.has(k) && !k.endsWith("Id"),
  );

  if (entries.length === 0) {
    return <span className="text-ink-faint">—</span>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-lg border border-line/60 bg-paper/40 p-3 text-body-sm w-full">
      {entries.map(([k, val]) => (
        <div key={k} className="flex flex-col gap-0.5 min-w-0">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted truncate">
            {fieldLabel(k)}
          </dt>
          <dd className="text-body-xs font-medium text-ink break-words">
            {formatObjectFieldValue(k, val, nestedLevel)}
          </dd>
        </div>
      ))}
    </div>
  );
}
