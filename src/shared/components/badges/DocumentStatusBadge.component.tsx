import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_DOCUMENT_CHECKLIST_STATUS } from "@/shared/constants/statuses";
import { documentStatusStyles } from "../../styles/badges/badgeComponents.styles";

interface DocumentStatusProps {
  status: string;
}

/** Pill badge for a KYC/vendor document's review status. */
export function DocumentStatusBadge({ status }: DocumentStatusProps) {
  switch (status) {
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED:
      return (
        <span className={documentStatusStyles.verifiedBadge}>
          <CheckCircle2
            className={documentStatusStyles.badgeIcon}
            aria-hidden
          />
          <span>{LABELS.documentVerified}</span>
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW:
      return (
        <span className={documentStatusStyles.pendingBadge}>
          <Clock className={documentStatusStyles.badgeIcon} aria-hidden />
          <span>{LABELS.documentPending}</span>
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED:
      return (
        <span className={documentStatusStyles.rejectedBadge}>
          <AlertCircle className={documentStatusStyles.badgeIcon} aria-hidden />
          <span>{LABELS.documentRejected}</span>
        </span>
      );
    default:
      return (
        <span className={documentStatusStyles.notUploadedBadge}>
          <FileText className={documentStatusStyles.badgeIcon} aria-hidden />
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
        <span className={documentStatusStyles.verifiedTile}>
          <CheckCircle2 className={documentStatusStyles.tileIcon} aria-hidden />
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW:
      return (
        <span className={documentStatusStyles.pendingTile}>
          <Clock className={documentStatusStyles.tileIcon} aria-hidden />
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED:
      return (
        <span className={documentStatusStyles.rejectedTile}>
          <AlertCircle className={documentStatusStyles.tileIcon} aria-hidden />
        </span>
      );
    default:
      return (
        <span className={documentStatusStyles.notUploadedTile}>
          <FileText className={documentStatusStyles.tileIcon} aria-hidden />
        </span>
      );
  }
}
