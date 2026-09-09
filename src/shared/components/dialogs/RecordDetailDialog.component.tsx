"use client";

import { RecordDetailImage } from "@/shared/components/RecordDetailImage.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";
import { isImageDetailValue } from "@/shared/utils/media/imageField";
import {
  buildRecordDetailFields,
  getRecordDetailTitle,
} from "@/shared/utils/formatting/recordDetails";
import { recordDetailDialogStyles } from "./dialogComponents.styles";

interface RecordDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: Record<string, unknown> | null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function formatDetailValue(key: string, value: unknown, label: string) {
  if (value == null || value === "") {
    return <span className={recordDetailDialogStyles.dash}>—</span>;
  }

  if (isImageDetailValue(key, value)) {
    return <RecordDetailImage value={value} alt={label} />;
  }

  if (typeof value === "boolean") {
    return value ? LABELS.yes : LABELS.no;
  }

  if (key === "status" || key.endsWith("Status") || key === "paymentStatus") {
    if (typeof value === "string" && value.trim()) {
      return <StatusBadge status={value} />;
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

  if (Array.isArray(value) || isPlainObject(value)) {
    return (
      <pre className={recordDetailDialogStyles.pre}>
        {JSON.stringify(value, null, 2)}
      </pre>
    );
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
}: RecordDetailDialogProps) {
  const fields = record ? buildRecordDetailFields(record) : [];
  const title = record ? getRecordDetailTitle(record) : LABELS.recordDetails;
  const isEmpty = fields.length === 0;
  const fieldRows = fields.map((field) => (
    <RecordDetailField key={field.key} field={field} />
  ));
  const detailContent = isEmpty ? (
    <p className={recordDetailDialogStyles.emptyText}>
      {LABELS.noDetailFields}
    </p>
  ) : (
    <dl className={recordDetailDialogStyles.list}>{fieldRows}</dl>
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
