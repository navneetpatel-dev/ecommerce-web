"use client";

import { AlertCircle } from "lucide-react";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { useKycChecklist } from "../../hooks/useKycChecklist.hook";
import { KycProgressBanner } from "./KycProgressBanner.component";
import { KycDocumentListItem } from "./KycDocumentListItem.component";

import { vendorShopSettingsFormStyles } from "./vendorShopSettingsForm.styles";

interface KycChecklistSectionProps {
  vendorId: string;
  saving: boolean;
  checklistKey: number;
}

export function KycChecklistSection({
  vendorId,
  saving,
  checklistKey,
}: KycChecklistSectionProps) {
  const {
    items,
    isComplete,
    checklistError,
    activeType,
    kycMessage,
    kycSaving,
    verifiedCount,
    totalCount,
    progressPercent,
    openKycDocument,
    onKycUploaded,
    toggleRow,
  } = useKycChecklist({ vendorId, checklistKey });

  return (
    <FormSection title={LABELS.kycChecklist} hint={LABELS.kycChecklistHint}>
      <KycProgressBanner
        isComplete={isComplete}
        verifiedCount={verifiedCount}
        totalCount={totalCount}
        progressPercent={progressPercent}
      />

      {checklistError ? (
        <div className={vendorShopSettingsFormStyles.alertBox}>
          <AlertCircle
            className={vendorShopSettingsFormStyles.alertIcon}
            aria-hidden
          />
          <span>{checklistError}</span>
        </div>
      ) : null}

      {items.length === 0 && !checklistError ? (
        <p className={vendorShopSettingsFormStyles.emptyText}>
          {LABELS.noKycDocuments}
        </p>
      ) : null}

      {/* Document List */}
      <div className={vendorShopSettingsFormStyles.checklistStack}>
        <p className={vendorShopSettingsFormStyles.checklistSubtitle}>
          {LABELS.kycSelectToUpload}
        </p>

        <ul className={vendorShopSettingsFormStyles.checklistGrid}>
          {items.map((item) => (
            <KycDocumentListItem
              key={item.documentType}
              item={item}
              vendorId={vendorId}
              saving={saving}
              kycSaving={kycSaving}
              isExpanded={activeType === item.documentType}
              onToggle={() => toggleRow(item.documentType)}
              onOpenDocument={(documentId) => void openKycDocument(documentId)}
              onUploaded={(url, documentType) =>
                void onKycUploaded(url, documentType)
              }
            />
          ))}
        </ul>
      </div>

      {kycMessage ? (
        <p
          className={vendorShopSettingsFormStyles.overrideNote}
          aria-live="polite"
        >
          {kycMessage}
        </p>
      ) : null}
    </FormSection>
  );
}
