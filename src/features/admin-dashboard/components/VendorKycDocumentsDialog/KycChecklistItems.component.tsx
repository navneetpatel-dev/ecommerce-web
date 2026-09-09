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
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
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
            className="group flex flex-col gap-3 rounded-lg border border-line bg-surface p-3.5 sm:p-4 transition-all hover:border-line-strong"
          >
            {/* Header & Actions Row */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              {/* Left section: icon and info */}
              <div className="flex min-w-0 items-center gap-3">
                <DocumentStatusIcon status={item.status} />
                <p className="text-body font-semibold text-ink">{typeLabel}</p>
              </div>

              {/* Right section: badges & actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 sm:shrink-0">
                <DocumentStatusBadge status={item.status} />

                {item.documentId && item.url ? (
                  <DocumentViewerBadge
                    url={item.url}
                    disabled={openingDocId === item.documentId}
                    onOpen={() => onOpenDocument(item.documentId!)}
                  />
                ) : null}

                {canReview ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-7.5 bg-brand px-3 text-xs font-medium text-paper hover:bg-brand-hover"
                      onClick={() => onVerify(item)}
                    >
                      {LABELS.verifyDocument}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7.5 px-3 text-xs font-medium"
                      onClick={() => onReject(item)}
                    >
                      {LABELS.rejectDocument}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Rejection Notice if present: Full-width underneath header row */}
            {item.rejectionReason ? (
              <div className="w-full pt-0.5">
                <KycRejectionNotice
                  reason={item.rejectionReason}
                  showActionHint={false}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
