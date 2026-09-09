import { ChevronDown, UploadCloud } from "lucide-react";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { DocumentViewerBadge } from "@/shared/components/DocumentViewerBadge.component";
import {
  DocumentStatusBadge,
  DocumentStatusIcon,
} from "@/shared/components/DocumentStatusBadge.component";
import { KycRejectionNotice } from "@/shared/components/KycRejectionNotice.component";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import type { KycChecklistItem } from "@/features/vendors";
import { vendorDocumentTypeLabel } from "@/shared/utils/formatting/vendorDocumentTypeLabel";
import { cn } from "@/shared/utils/dom/cn";

import { vendorShopSettingsFormStyles } from "./vendorShopSettingsForm.styles";

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
        vendorShopSettingsFormStyles.itemRoot,
        isExpanded
          ? vendorShopSettingsFormStyles.itemExpanded
          : vendorShopSettingsFormStyles.itemCollapsed,
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
        className={vendorShopSettingsFormStyles.headerButton}
      >
        {/* Primary Row: Desktop = 1 horizontal row; Mobile = Title on top, Badges below */}
        <div className={vendorShopSettingsFormStyles.headerRow}>
          {/* Left Info: Icon & Title */}
          <div className={vendorShopSettingsFormStyles.headerLeftCol}>
            <div className={vendorShopSettingsFormStyles.headerGroup}>
              <DocumentStatusIcon status={item.status} />
              <div className={vendorShopSettingsFormStyles.titleGroup}>
                <span className={vendorShopSettingsFormStyles.docTitle}>
                  {vendorDocumentTypeLabel(item.documentType)}
                </span>
                {isExpanded ? (
                  <span className={vendorShopSettingsFormStyles.reqDot} />
                ) : null}
              </div>
            </div>

            {/* Mobile Chevron toggle on top row */}
            <div className={vendorShopSettingsFormStyles.chevronMobile}>
              <ChevronDown
                className={cn(
                  vendorShopSettingsFormStyles.chevronIcon,
                  isExpanded &&
                    vendorShopSettingsFormStyles.chevronIconExpanded,
                )}
                aria-hidden
              />
            </div>
          </div>

          {/* Badges & Actions Strip: Below title on mobile, Right-aligned on desktop */}
          <div className={vendorShopSettingsFormStyles.badgesGroup}>
            <DocumentStatusBadge status={item.status} />

            {hasDocument ? (
              <DocumentViewerBadge
                url={item.url}
                onOpen={() => onOpenDocument(item.documentId!)}
              />
            ) : null}

            {/* Desktop Chevron Indicator */}
            <div className={vendorShopSettingsFormStyles.chevronDesktop}>
              <ChevronDown
                className={cn(
                  vendorShopSettingsFormStyles.chevronIcon,
                  isExpanded &&
                    vendorShopSettingsFormStyles.chevronIconExpanded,
                )}
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Rejection Notice Component: Spans full width cleanly beneath the header row */}
        {item.rejectionReason ? (
          <div className={vendorShopSettingsFormStyles.remarksRow}>
            <KycRejectionNotice reason={item.rejectionReason} />
          </div>
        ) : null}
      </div>

      {/* Animated Accordion Drawer: Expands directly underneath the row */}
      <div
        className={cn(
          vendorShopSettingsFormStyles.drawer,
          isExpanded
            ? vendorShopSettingsFormStyles.drawerExpanded
            : vendorShopSettingsFormStyles.drawerCollapsed,
        )}
      >
        <div className={vendorShopSettingsFormStyles.collapseBody}>
          <div className={vendorShopSettingsFormStyles.collapseContent}>
            <div className={vendorShopSettingsFormStyles.uploadHeadingRow}>
              <div className={vendorShopSettingsFormStyles.uploadIconBox}>
                <UploadCloud
                  className={vendorShopSettingsFormStyles.uploadIcon}
                  aria-hidden
                />
              </div>
              <div>
                <h4 className={vendorShopSettingsFormStyles.uploadTitle}>
                  {LABELS.uploadKycDocument}:{" "}
                  {vendorDocumentTypeLabel(item.documentType)}
                </h4>
                <p className={vendorShopSettingsFormStyles.uploadSubtitle}>
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
