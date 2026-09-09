"use client";

import type { KycChecklistItem } from "@/features/vendors";
import { KycChecklistItemRow } from "./KycChecklistItemRow.component";
import { vendorKycDocumentsDialogStyles as styles } from "./vendorKycDocumentsDialog.styles";

interface KycChecklistItemsProps {
  items: KycChecklistItem[];
  openingDocId: string | null;
  onOpenDocument: (documentId: string) => void;
  onVerify: (item: KycChecklistItem) => void;
  onReject: (item: KycChecklistItem) => void;
}

export function KycChecklistItems({
  items,
  openingDocId,
  onOpenDocument,
  onVerify,
  onReject,
}: KycChecklistItemsProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <KycChecklistItemRow
          key={item.documentType}
          item={item}
          openingDocId={openingDocId}
          onOpenDocument={onOpenDocument}
          onVerify={onVerify}
          onReject={onReject}
        />
      ))}
    </ul>
  );
}
