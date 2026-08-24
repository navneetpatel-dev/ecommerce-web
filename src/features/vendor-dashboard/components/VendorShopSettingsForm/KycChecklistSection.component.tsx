"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  UploadCloud,
  ChevronDown,
} from "lucide-react";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormSection } from "@/shared/components/forms";
import { DocumentViewerBadge } from "@/shared/components/DocumentViewerBadge.component";
import { KycRejectionNotice } from "@/shared/components/KycRejectionNotice.component";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import {
  VENDOR_DOCUMENT_CHECKLIST_STATUS,
  type VendorDocumentType,
} from "@/shared/constants/statuses";
import { vendorsApi, type KycChecklistItem } from "@/features/vendors";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { cn } from "@/shared/utils/cn";

interface KycChecklistSectionProps {
  vendorId: string;
  saving: boolean;
  checklistKey: number;
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
        <span className="inline-flex h-7.5 items-center gap-1.5 rounded-full border border-line-strong/40 bg-ink-muted/10 px-2.5 text-xs font-medium text-ink-muted whitespace-nowrap">
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
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="size-4.5" aria-hidden />
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.PENDING_REVIEW:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30">
          <Clock className="size-4.5" aria-hidden />
        </span>
      );
    case VENDOR_DOCUMENT_CHECKLIST_STATUS.REJECTED:
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30">
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

export function KycChecklistSection({
  vendorId,
  saving,
  checklistKey,
}: KycChecklistSectionProps) {
  const [items, setItems] = useState<KycChecklistItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [checklistError, setChecklistError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<VendorDocumentType | null>(null);
  const [kycMessage, setKycMessage] = useState<string | null>(null);
  const [kycSaving, setKycSaving] = useState(false);

  const loadChecklist = useCallback(async () => {
    if (!vendorId) return;
    try {
      const checklist = await vendorsApi.getMyKycChecklist();
      setItems(checklist.items);
      setIsComplete(checklist.isComplete);
      setChecklistError(null);
    } catch (err) {
      setChecklistError(
        getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist),
      );
      setItems([]);
    }
  }, [vendorId]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadChecklist();
    });
  }, [loadChecklist, checklistKey]);

  const openKycDocument = async (documentId: string) => {
    try {
      const { url } = await vendorsApi.getDocumentViewUrl(documentId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setKycMessage(getApiErrorMessage(err, LABELS.couldNotOpenDocument));
    }
  };

  const onKycUploaded = async (
    url: string,
    documentType: VendorDocumentType,
  ) => {
    setKycSaving(true);
    setKycMessage(null);
    try {
      await vendorsApi.uploadMyDocument({ type: documentType, url });
      setKycMessage(LABELS.kycDocumentUploaded);
      await loadChecklist();
    } catch (err) {
      setKycMessage(getApiErrorMessage(err, LABELS.couldNotUploadKycDocument));
    } finally {
      setKycSaving(false);
    }
  };

  const verifiedCount = items.filter(
    (item) => item.status === VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED,
  ).length;
  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const toggleRow = (documentType: VendorDocumentType) => {
    setActiveType((current) =>
      current === documentType ? null : documentType,
    );
  };

  return (
    <FormSection title={LABELS.kycChecklist} hint={LABELS.kycChecklistHint}>
      {/* Progress & Status Banner */}
      <div className="sm:col-span-2 overflow-hidden rounded-lg border border-line bg-paper/60 p-4 transition-colors">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                isComplete
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30"
                  : "bg-brand-subtle text-brand ring-2 ring-brand/30",
              )}
            >
              <ShieldCheck className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-body font-semibold tracking-tight text-ink">
                {isComplete
                  ? LABELS.kycAllDocumentsVerified
                  : LABELS.kycVerificationProgress}
              </p>
              <p className="text-body-sm text-ink-muted">
                {isComplete
                  ? LABELS.kycChecklistComplete
                  : LABELS.kycChecklistIncomplete}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-body-sm font-semibold text-ink">
              {LABELS.kycDocumentsVerifiedCount
                .replace("{verified}", String(verifiedCount))
                .replace("{total}", String(totalCount))}
            </span>
            <span className="text-body-sm text-ink-faint">
              ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {totalCount > 0 && !isComplete ? (
          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-line/60">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        ) : null}
      </div>

      {checklistError ? (
        <div className="sm:col-span-2 flex items-center gap-2 rounded-md border border-danger/30 bg-danger-subtle/50 px-3.5 py-2.5 text-body-sm text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          <span>{checklistError}</span>
        </div>
      ) : null}

      {items.length === 0 && !checklistError ? (
        <p className="sm:col-span-2 text-body-sm text-ink-muted">
          {LABELS.noKycDocuments}
        </p>
      ) : null}

      {/* Document List */}
      <div className="sm:col-span-2 space-y-2.5">
        <p className="text-body-sm font-medium text-ink-muted">
          {LABELS.kycSelectToUpload}
        </p>

        <ul className="grid gap-2.5 sm:grid-cols-1">
          {items.map((item) => {
            const isExpanded = activeType === item.documentType;
            const hasDocument = Boolean(item.documentId && item.url);

            return (
              <li
                key={item.documentType}
                className={cn(
                  "group overflow-hidden rounded-lg border transition-all",
                  isExpanded
                    ? "border-brand/80 bg-brand-subtle/15 shadow-xs ring-1 ring-brand/40"
                    : "border-line bg-surface hover:border-line-strong hover:bg-surface-raised",
                )}
              >
                {/* Clickable Card Header */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleRow(item.documentType)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleRow(item.documentType);
                    }
                  }}
                  className="flex flex-col gap-2.5 p-3.5 sm:p-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                >
                  {/* Primary Row: Desktop = 1 horizontal row; Mobile = Title on top, Badges below */}
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    {/* Left Info: Icon & Title */}
                    <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
                      <div className="flex min-w-0 items-center gap-3">
                        {getDocumentStatusIcon(item.status)}
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-body font-semibold text-ink group-hover:text-brand transition-colors">
                            {vendorDocumentTypeLabel(item.documentType)}
                          </span>
                          {isExpanded ? (
                            <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                          ) : null}
                        </div>
                      </div>

                      {/* Mobile Chevron toggle on top row */}
                      <div className="flex sm:hidden size-7 shrink-0 items-center justify-center rounded-md text-ink-muted group-hover:text-ink">
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-300 ease-out",
                            isExpanded && "rotate-180 text-brand",
                          )}
                          aria-hidden
                        />
                      </div>
                    </div>

                    {/* Badges & Actions Strip: Below title on mobile, Right-aligned on desktop */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 sm:shrink-0">
                      {getDocumentStatusBadge(item.status)}

                      {hasDocument ? (
                        <DocumentViewerBadge
                          url={item.url}
                          onOpen={() => void openKycDocument(item.documentId!)}
                        />
                      ) : null}

                      {/* Desktop Chevron Indicator */}
                      <div className="hidden sm:flex size-7 shrink-0 items-center justify-center rounded-md text-ink-muted group-hover:text-ink">
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-300 ease-out",
                            isExpanded && "rotate-180 text-brand",
                          )}
                          aria-hidden
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rejection Notice Component: Spans full width cleanly beneath the header row */}
                  {item.rejectionReason ? (
                    <div className="w-full pt-0.5">
                      <KycRejectionNotice reason={item.rejectionReason} />
                    </div>
                  ) : null}
                </div>

                {/* Animated Accordion Drawer: Expands directly underneath the row */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100 border-t border-line/60 bg-surface/90"
                      : "grid-rows-[0fr] opacity-0 border-t-0 pointer-events-none",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div className="flex items-start gap-3 border-b border-line/70 pb-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand ring-1 ring-brand/30">
                          <UploadCloud className="size-4.5" aria-hidden />
                        </div>
                        <div>
                          <h4 className="text-body font-semibold text-ink">
                            {LABELS.uploadKycDocument}:{" "}
                            {vendorDocumentTypeLabel(item.documentType)}
                          </h4>
                          <p className="text-body-sm text-ink-muted">
                            {hasDocument
                              ? LABELS.kycReplaceDocumentNotice
                              : LABELS.uploadKycDocumentHint}
                          </p>
                        </div>
                      </div>

                      <FileUpload
                        entityType={UPLOAD_ENTITY.VENDORS}
                        entityId={vendorId}
                        purpose={UPLOAD_PURPOSE.KYC}
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        onUploaded={(url) =>
                          void onKycUploaded(url, item.documentType)
                        }
                        disabled={!vendorId || saving || kycSaving}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {kycMessage ? (
        <p
          className="sm:col-span-2 text-body-sm text-ink-muted"
          aria-live="polite"
        >
          {kycMessage}
        </p>
      ) : null}
    </FormSection>
  );
}
