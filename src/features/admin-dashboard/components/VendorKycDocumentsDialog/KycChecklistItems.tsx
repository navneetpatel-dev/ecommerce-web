"use client";

import { FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_DOCUMENT_CHECKLIST_STATUS } from "@/shared/constants/statuses";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import { vendorDocumentChecklistStatusLabel } from "@/shared/utils/vendorDocumentChecklistStatusLabel";
import type { KycChecklistItem } from "@/features/vendors";

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
    <ul className="space-y-3">
      {items.map((item) => {
        const typeLabel = vendorDocumentTypeLabel(item.documentType);
        const canReview =
          Boolean(item.documentId) &&
          item.status !== VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED &&
          item.status !== VENDOR_DOCUMENT_CHECKLIST_STATUS.NOT_UPLOADED;
        return (
          <li
            key={item.documentType}
            className="flex flex-col gap-3 rounded-md border border-line bg-surface px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="truncate text-[0.9375rem] font-medium text-ink">
                {typeLabel}
              </p>
              <p className="text-[0.8125rem] text-ink-muted">
                {vendorDocumentChecklistStatusLabel(item.status)}
              </p>
              {item.rejectionReason ? (
                <p className="text-[0.75rem] text-danger">
                  {LABELS.documentRejectionReason}: {item.rejectionReason}
                </p>
              ) : null}
              {item.documentId ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => onOpenDocument(item.documentId!)}
                  disabled={openingDocId === item.documentId}
                  className="h-auto min-h-0 max-h-none gap-1.5 px-0 py-0 text-[0.8125rem] font-medium text-brand"
                >
                  <FileText className="size-3.5" aria-hidden />
                  {LABELS.openDocument}
                </Button>
              ) : null}
            </div>
            {canReview ? (
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  className="bg-brand text-paper hover:bg-brand-hover"
                  onClick={() => onVerify(item)}
                >
                  {LABELS.verifyDocument}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(item)}
                >
                  {LABELS.rejectDocument}
                </Button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
