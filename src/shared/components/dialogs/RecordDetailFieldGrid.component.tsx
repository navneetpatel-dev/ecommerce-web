"use client";

import type { ReactNode } from "react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { formatReasonLabel } from "@/shared/utils/formatting/formatStatus";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import {
  isMoneyKey,
  type RecordDetailField,
} from "@/shared/utils/formatting/recordDetails";
import { cn } from "@/shared/utils/dom/cn";
import { recordDetailDialogStyles as styles } from "../../styles/dialogs/dialogComponents.styles";
import { RecordDetailCopyButton } from "./RecordDetailCopyButton.component";

interface RecordDetailFieldGridProps {
  fields: RecordDetailField[];
}

function isLongField(key: string, value: unknown): boolean {
  if (typeof value !== "string") return false;
  const lower = key.toLowerCase();
  return (
    value.length > 70 ||
    lower.includes("description") ||
    lower.includes("reason") ||
    lower.includes("note") ||
    lower.includes("message")
  );
}

function renderFieldValue(key: string, value: unknown): ReactNode {
  if (value == null || value === "") {
    return <span className={styles.dash}>—</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-semibold ${
          value
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
            : "bg-ink-muted/10 text-ink-muted border border-ink-muted/20"
        }`}
      >
        {value ? LABELS.yes : LABELS.no}
      </span>
    );
  }
  if (key === "status" || key.endsWith("Status") || key === "paymentStatus") {
    if (typeof value === "string" && value.trim()) {
      return <StatusBadge status={value} />;
    }
  }
  if (key === "reasonCode" || key.endsWith("ReasonCode")) {
    if (typeof value === "string" && value.trim()) {
      return <span>{formatReasonLabel(value)}</span>;
    }
  }
  if (isMoneyKey(key)) {
    const num = Number(value);
    if (!isNaN(num)) {
      return <span className={styles.numVal}>{formatInr(num)}</span>;
    }
  }
  if (key.endsWith("Percentage") || key.endsWith("Rate")) {
    const num = Number(value);
    if (!isNaN(num)) return <span className={styles.numVal}>{num}%</span>;
  }
  const asDate = tryFormatDateTime(value);
  if (asDate) return <span>{asDate}</span>;

  const str = String(value);
  const isCopyable =
    str.includes("@") ||
    key.toLowerCase().includes("phone") ||
    key.toLowerCase().includes("tracking") ||
    key.toLowerCase().includes("code");

  if (isLongField(key, value)) {
    return (
      <p className="whitespace-pre-line leading-relaxed text-body-sm text-ink break-words">
        {str}
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1.5 min-w-0">
      <span className={styles.stringVal}>{str}</span>
      {isCopyable && <RecordDetailCopyButton value={str} />}
    </div>
  );
}

export function RecordDetailFieldGrid({ fields }: RecordDetailFieldGridProps) {
  if (fields.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line/60">
        <h3 className="text-body-sm font-semibold text-ink">
          General Information
        </h3>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-paper border border-line/70 text-ink-muted">
          {fields.length} {fields.length === 1 ? "field" : "fields"}
        </span>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fields.map((field) => {
          const isLong = isLongField(field.key, field.value);
          return (
            <div
              key={field.key}
              className={cn(
                styles.fieldRow,
                isLong && "sm:col-span-2 lg:col-span-3",
              )}
            >
              <dt className={styles.fieldLabel}>{field.label}</dt>
              <dd className={styles.fieldValue}>
                {renderFieldValue(field.key, field.value)}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
