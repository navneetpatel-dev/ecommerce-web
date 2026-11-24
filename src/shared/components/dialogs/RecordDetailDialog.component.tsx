"use client";

import { RecordDetailImage } from "@/shared/components/dialogs/RecordDetailImage.component";
import { RecordDetailObjectView } from "@/shared/components/dialogs/RecordDetailObjectView.component";
import { RecordDetailListView } from "@/shared/components/dialogs/RecordDetailListView.component";
import { RecordDetailSkeleton } from "@/shared/components/dialogs/RecordDetailSkeleton.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatReasonLabel } from "@/shared/utils/formatting/formatStatus";
import {
  isImageFieldKey,
  extractImageUrls,
} from "@/shared/utils/media/imageField";
import {
  buildRecordDetailFields,
  getRecordDetailTitle,
  isMoneyKey,
} from "@/shared/utils/formatting/recordDetails";
import { recordDetailDialogStyles } from "../../styles/dialogs/dialogComponents.styles";

interface RecordDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: Record<string, unknown> | null;
  loading?: boolean;
  error?: string | null;
}

function formatDetailValue(key: string, value: unknown, label: string) {
  if (value == null || value === "") {
    return <span className={recordDetailDialogStyles.dash}>—</span>;
  }

  if (isImageFieldKey(key)) {
    const urls = extractImageUrls(value);
    if (urls.length > 0) {
      return <RecordDetailImage value={value} alt={label} />;
    }
    return <span className={recordDetailDialogStyles.dash}>—</span>;
  }

  if (typeof value === "boolean") {
    return value ? LABELS.yes : LABELS.no;
  }

  if (key === "status" || key.endsWith("Status") || key === "paymentStatus") {
    if (typeof value === "string" && value.trim()) {
      return <StatusBadge status={value} />;
    }
  }

  if (key === "reasonCode" || key.endsWith("ReasonCode")) {
    if (typeof value === "string" && value.trim()) {
      return (
        <span className={recordDetailDialogStyles.stringVal}>
          {formatReasonLabel(value)}
        </span>
      );
    }
  }

  if (
    key === "orderReference" ||
    key === "returnReference" ||
    key === "reference"
  ) {
    const str = String(value);
    return (
      <span className={recordDetailDialogStyles.stringVal}>
        {str.startsWith("#") ? str : `#${str}`}
      </span>
    );
  }

  if (isMoneyKey(key)) {
    if (
      typeof value === "number" ||
      (typeof value === "string" &&
        !isNaN(Number(value)) &&
        value.trim() !== "")
    ) {
      return (
        <span className={recordDetailDialogStyles.numVal}>
          {formatInr(Number(value))}
        </span>
      );
    }
  }

  const asDate = tryFormatDateTime(value);
  if (asDate) return asDate;

  if (typeof value === "string") {
    return <span className={recordDetailDialogStyles.stringVal}>{value}</span>;
  }

  if (typeof value === "number") {
    return <span className={recordDetailDialogStyles.numVal}>{value}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className={recordDetailDialogStyles.dash}>—</span>;
    }
    return <RecordDetailListView items={value} />;
  }

  if (typeof value === "object" && value !== null) {
    if (Object.keys(value).length === 0) {
      return <span className={recordDetailDialogStyles.dash}>—</span>;
    }
    return <RecordDetailObjectView value={value as Record<string, unknown>} />;
  }

  return String(value);
}

/** Presentational modal listing every safe field on a table row. */
function RecordDetailField({
  field,
}: {
  field: { key: string; value: unknown; label: string };
}) {
  const formattedValue = formatDetailValue(field.key, field.value, field.label);

  return (
    <div className={recordDetailDialogStyles.fieldRow}>
      <dt className={recordDetailDialogStyles.fieldLabel}>{field.label}</dt>
      <dd className={recordDetailDialogStyles.fieldValue}>{formattedValue}</dd>
    </div>
  );
}

export function RecordDetailDialog({
  open,
  onOpenChange,
  record,
  loading = false,
  error = null,
}: RecordDetailDialogProps) {
  const fields = record ? buildRecordDetailFields(record) : [];
  const title = record ? getRecordDetailTitle(record) : LABELS.recordDetails;
  const isEmpty = fields.length === 0;
  const fieldRows = fields.map((field) => (
    <RecordDetailField key={field.key} field={field} />
  ));
  const detailContent = loading ? (
    <RecordDetailSkeleton />
  ) : isEmpty ? (
    <p className={recordDetailDialogStyles.emptyText}>
      {LABELS.noDetailFields}
    </p>
  ) : (
    <>
      {error && (
        <p className="text-xs text-amber-500 mb-2">
          Showing cached summary ({error})
        </p>
      )}
      <dl className={recordDetailDialogStyles.list}>{fieldRows}</dl>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={recordDetailDialogStyles.content}>
        <DialogHeader>
          <DialogTitle className={recordDetailDialogStyles.title}>
            {title}
          </DialogTitle>
          <DialogDescription>{LABELS.recordDetailsHint}</DialogDescription>
        </DialogHeader>

        {detailContent}
      </DialogContent>
    </Dialog>
  );
}
