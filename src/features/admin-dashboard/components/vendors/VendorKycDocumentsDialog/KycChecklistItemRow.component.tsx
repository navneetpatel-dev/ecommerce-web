"use client";

import { Button } from "@/shared/components/ui/button";
import { DocumentViewerBadge } from "@/shared/components/DocumentViewerBadge.component";
import {
  DocumentStatusBadge,
  DocumentStatusIcon,
} from "@/shared/components/DocumentStatusBadge.component";
import { KycRejectionNotice } from "@/shared/components/KycRejectionNotice.component";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_DOCUMENT_CHECKLIST_STATUS } from "@/shared/constants/statuses";
import { vendorDocumentTypeLabel } from "@/shared/utils/formatting/vendorDocumentTypeLabel";
import type { KycChecklistItem } from "@/features/vendors";
import { vendorKycDocumentsDialogStyles as styles } from "../../../styles/vendors/vendorKycDocumentsDialog.styles";

interface KycChecklistItemRowProps {
  item: KycChecklistItem;
  openingDocId: string | null;
  onOpenDocument: (documentId: string) => void;
  onVerify: (item: KycChecklistItem) => void;
  onReject: (item: KycChecklistItem) => void;
}

export function KycChecklistItemRow({
  item,
  openingDocId,
  onOpenDocument,
  onVerify,
  onReject,
}: KycChecklistItemRowProps) {
  const typeLabel = vendorDocumentTypeLabel(item.documentType);
  const canReview =
    Boolean(item.documentId) &&
    item.status !== VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED &&
    item.status !== VENDOR_DOCUMENT_CHECKLIST_STATUS.NOT_UPLOADED;

  const handleOpenDoc = () => {
    if (item.documentId) onOpenDocument(item.documentId);
  };

  const handleVerifyClick = () => {
    onVerify(item);
  };

  const handleRejectClick = () => {
    onReject(item);
  };

  const viewerBadge =
    item.documentId && item.url ? (
      <DocumentViewerBadge
        url={item.url}
        disabled={openingDocId === item.documentId}
        onOpen={handleOpenDoc}
      />
    ) : null;

  const actions = canReview ? (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={styles.verifyButton}
        onClick={handleVerifyClick}
      >
        {LABELS.verifyDocument}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={styles.rejectButton}
        onClick={handleRejectClick}
      >
        {LABELS.rejectDocument}
      </Button>
    </>
  ) : null;

  const rejectionNotice = item.rejectionReason ? (
    <KycRejectionNotice reason={item.rejectionReason} />
  ) : null;

  return (
    <li className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <DocumentStatusIcon status={item.status} />
          <p className={styles.itemTitle}>{typeLabel}</p>
        </div>

        <div className={styles.itemBadgesRow}>
          <DocumentStatusBadge status={item.status} />
          {viewerBadge}
          {actions}
        </div>
      </div>

      {rejectionNotice}
    </li>
  );
}
