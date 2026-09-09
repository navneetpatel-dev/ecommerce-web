"use client";

import { AlertCircle } from "lucide-react";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { useKycChecklist } from "../../hooks/useKycChecklist.hook";
import { KycProgressBanner } from "./KycProgressBanner.component";
import { KycDocumentListItem } from "./KycDocumentListItem.component";

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
          className="sm:col-span-2 text-body-sm text-ink-muted"
          aria-live="polite"
        >
          {kycMessage}
        </p>
      ) : null}
    </FormSection>
  );
}
