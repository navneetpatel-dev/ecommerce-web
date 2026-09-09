import { ChevronDown, UploadCloud } from "lucide-react";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { DocumentViewerBadge } from "@/shared/components/DocumentViewerBadge.component";
import {
  DocumentStatusBadge,
  DocumentStatusIcon,
} from "@/shared/components/DocumentStatusBadge.component";
import { KycRejectionNotice } from "@/shared/components/KycRejectionNotice.component";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import type { KycChecklistItem } from "@/features/vendors";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import { cn } from "@/shared/utils/cn";

interface KycDocumentListItemProps {
  item: KycChecklistItem;
  vendorId: string;
  saving: boolean;
  kycSaving: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenDocument: (documentId: string) => void;
  onUploaded: (url: string, documentType: VendorDocumentType) => void;
}

export function KycDocumentListItem({
  item,
  vendorId,
  saving,
  kycSaving,
  isExpanded,
  onToggle,
  onOpenDocument,
  onUploaded,
}: KycDocumentListItemProps) {
  const hasDocument = Boolean(item.documentId && item.url);

  return (
    <li
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
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex flex-col gap-2.5 p-3.5 sm:p-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      >
        {/* Primary Row: Desktop = 1 horizontal row; Mobile = Title on top, Badges below */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          {/* Left Info: Icon & Title */}
          <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
            <div className="flex min-w-0 items-center gap-3">
              <DocumentStatusIcon status={item.status} />
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
            <DocumentStatusBadge status={item.status} />

            {hasDocument ? (
              <DocumentViewerBadge
                url={item.url}
                onOpen={() => onOpenDocument(item.documentId!)}
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
              onUploaded={(url) => onUploaded(url, item.documentType)}
              disabled={!vendorId || saving || kycSaving}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
