"use client";

import {
  Calendar,
  FileText,
  Package,
  Shield,
  Tag,
  User,
  Wallet,
} from "lucide-react";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { LABELS } from "@/shared/constants/labels";
import { recordDetailDialogStyles as styles } from "../../styles/dialogs/dialogComponents.styles";
import { RecordDetailCopyButton } from "./RecordDetailCopyButton.component";

interface RecordDetailHeaderProps {
  record: Record<string, unknown>;
  title: string;
}

function resolveRecordIcon(record: Record<string, unknown>) {
  if (record.orderReference || record.orderNumber || record.productName) {
    return <Package className="size-5" aria-hidden />;
  }
  if (record.role || record.permissions || record.permissionCount) {
    return <Shield className="size-5" aria-hidden />;
  }
  if (record.email || record.customerName || record.vendorName) {
    return <User className="size-5" aria-hidden />;
  }
  if (record.balance || record.walletRefundAmount || record.cashbackType) {
    return <Wallet className="size-5" aria-hidden />;
  }
  if (record.couponCode || record.code || record.gstPercentage) {
    return <Tag className="size-5" aria-hidden />;
  }
  return <FileText className="size-5" aria-hidden />;
}

function getRecordReference(
  record: Record<string, unknown>,
): { short: string; full: string } | null {
  const ref =
    record.returnReference ??
    record.orderReference ??
    record.reference ??
    record.code;
  if (typeof ref === "string" && ref.trim()) {
    const clean = ref.trim();
    return {
      short: clean.startsWith("#") ? clean : `#${clean}`,
      full: clean.replace(/^#/, ""),
    };
  }
  if (typeof record.id === "string" && record.id.trim()) {
    const clean = record.id.trim();
    return {
      short: clean.length > 12 ? `#${clean.slice(0, 8)}` : `#${clean}`,
      full: clean,
    };
  }
  return null;
}

export function RecordDetailHeader({ record, title }: RecordDetailHeaderProps) {
  const icon = resolveRecordIcon(record);
  const reference = getRecordReference(record);
  const status =
    typeof record.status === "string"
      ? record.status
      : typeof record.paymentStatus === "string"
        ? record.paymentStatus
        : null;

  const dateValue = record.createdAt ?? record.sentAt ?? record.updatedAt;
  const formattedDate = dateValue ? tryFormatDateTime(dateValue) : null;

  return (
    <DialogHeader className={styles.header}>
      <div className="flex items-start gap-3.5">
        <div className={styles.titleIconWrap}>{icon}</div>
        <div className="min-w-0 flex-1 space-y-1">
          <DialogTitle className={styles.title}>
            <span className="truncate">{title}</span>
          </DialogTitle>
          <DialogDescription className="text-body-xs text-ink-muted">
            {LABELS.recordDetailsHint}
          </DialogDescription>

          <div className={styles.badgeRow}>
            {status ? <StatusBadge status={status} /> : null}
            {typeof record.kind === "string" && record.kind.trim() ? (
              <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                {record.kind}
              </span>
            ) : null}
            {typeof record.submission === "string" &&
            record.submission.trim() ? (
              <span className="inline-flex items-center rounded-md bg-paper px-2 py-0.5 text-[11px] font-medium text-ink-muted border border-line/60">
                {record.submission}
              </span>
            ) : null}
            {reference ? (
              <span className={styles.referenceBadge}>
                <span>{reference.short}</span>
                <RecordDetailCopyButton
                  value={reference.full}
                  label="Copy ID"
                />
              </span>
            ) : null}
            {formattedDate ? (
              <span className={styles.dateBadge}>
                <Calendar className="size-3 text-ink-muted/70" aria-hidden />
                <span>{formattedDate}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </DialogHeader>
  );
}
