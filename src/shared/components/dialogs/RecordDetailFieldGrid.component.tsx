"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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

export type RecordDetailFieldLinks = Record<
  string,
  (value: unknown, record: Record<string, unknown>) => string | null
>;

interface RecordDetailFieldGridProps {
  fields: RecordDetailField[];
  record?: Record<string, unknown> | null;
  fieldLinks?: RecordDetailFieldLinks;
  onNavigate?: () => void;
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

export function RecordDetailFieldGrid({
  fields,
  record,
  fieldLinks,
  onNavigate,
}: RecordDetailFieldGridProps) {
  if (fields.length === 0) return null;

  const useTwoCols = fields.length >= 5;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between border-b border-line/60 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Details
        </h3>
        <span className="text-[11px] font-mono text-ink-muted/80">
          {fields.length} {fields.length === 1 ? "field" : "fields"}
        </span>
      </div>
      <dl
        className={cn(
          useTwoCols
            ? "grid grid-cols-1 md:grid-cols-2 gap-x-8"
            : "flex flex-col",
        )}
      >
        {fields.map((field) => {
          const isLong = isLongField(field.key, field.value);
          const linkHref =
            record && fieldLinks?.[field.key]
              ? fieldLinks[field.key](field.value, record)
              : null;
          return (
            <div
              key={field.key}
              className={cn(
                "flex items-baseline justify-between gap-4 border-b border-line/40 py-2.5",
                isLong && useTwoCols && "md:col-span-2",
              )}
            >
              <dt className="text-xs font-medium text-ink-muted shrink-0 max-w-[42%] truncate">
                {field.label}
              </dt>
              <dd className="text-body-sm font-medium text-ink text-right min-w-0 break-words">
                {linkHref ? (
                  <Link
                    href={linkHref}
                    onClick={onNavigate}
                    className="inline-flex items-center gap-1 font-mono text-brand hover:underline"
                    title="View email template"
                  >
                    <span>{String(field.value)}</span>
                    <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                  </Link>
                ) : (
                  renderFieldValue(field.key, field.value)
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
