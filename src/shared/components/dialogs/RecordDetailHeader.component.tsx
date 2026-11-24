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

function getRecordReference(record: Record<string, unknown>): string | null {
  const ref =
    record.returnReference ??
    record.orderReference ??
    record.reference ??
    record.code;
  if (typeof ref === "string" && ref.trim()) {
    return ref.trim().startsWith("#") ? ref.trim() : `#${ref.trim()}`;
  }
  if (typeof record.id === "string" && record.id.length <= 16) {
    return `#${record.id}`;
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
            {reference ? (
              <span className={styles.referenceBadge}>
                <span>{reference}</span>
                <RecordDetailCopyButton
                  value={reference.replace(/^#/, "")}
                  label="Copy reference ID"
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
