import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_DOCUMENT_CHECKLIST_STATUS } from "@/shared/constants/statuses";

interface DocumentStatusProps {
  status: string;
}

/** Pill badge for a KYC/vendor document's review status. */
export function DocumentStatusBadge({ status }: DocumentStatusProps) {
  switch (status) {
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED:
      return (
        <span className="inline-flex h-7.5 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
          <span>{LABELS.documentVerified}</span>
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW:
      return (
        <span className="inline-flex h-7.5 items-center gap-1.5 rounded-full border border-warning/30 bg-warning-subtle px-2.5 text-xs font-semibold text-warning whitespace-nowrap">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          <span>{LABELS.documentPending}</span>
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED:
      return (
        <span className="inline-flex h-7.5 items-center gap-1.5 rounded-full border border-danger/30 bg-danger-subtle px-2.5 text-xs font-semibold text-danger whitespace-nowrap">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          <span>{LABELS.documentRejected}</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex h-7.5 items-center gap-1.5 rounded-full border border-line-strong/50 bg-line/30 px-2.5 text-xs font-medium text-ink-muted whitespace-nowrap">
          <FileText className="size-3.5 shrink-0" aria-hidden />
          <span>{LABELS.documentNotUploaded}</span>
        </span>
      );
  }
}

/** Icon tile for a KYC/vendor document's review status. */
export function DocumentStatusIcon({ status }: DocumentStatusProps) {
  switch (status) {
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-subtle text-success ring-1 ring-success/30">
          <CheckCircle2 className="size-4.5" aria-hidden />
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning ring-1 ring-warning/30">
          <Clock className="size-4.5" aria-hidden />
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger-subtle text-danger ring-1 ring-danger/30">
          <AlertCircle className="size-4.5" aria-hidden />
        </span>
      );
    default:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-paper text-ink-muted ring-1 ring-line">
          <FileText className="size-4.5" aria-hidden />
        </span>
      );
  }
}
