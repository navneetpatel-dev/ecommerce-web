"use client";

import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DocumentViewerBadge } from "@/shared/components/DocumentViewerBadge.component";
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

function getDocumentStatusBadge(status: string) {
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

function getDocumentStatusIcon(status: string) {
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
                {getDocumentStatusIcon(item.status)}
                <p className="text-body font-semibold text-ink">{typeLabel}</p>
              </div>

              {/* Right section: badges & actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 sm:shrink-0">
                {getDocumentStatusBadge(item.status)}

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
