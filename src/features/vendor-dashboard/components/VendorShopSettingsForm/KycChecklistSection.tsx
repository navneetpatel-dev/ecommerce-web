"use client";

import { useCallback, useEffect, useState } from "react";
import { FileUpload } from "@/shared/components/FileUpload";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import { vendorsApi, type KycChecklistItem } from "@/features/vendors";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import { vendorDocumentChecklistStatusLabel } from "@/shared/utils/vendorDocumentChecklistStatusLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

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
      setActiveType((current) => {
        if (
          current &&
          checklist.items.some((item) => item.documentType === current)
        ) {
          return current;
        }
        return checklist.items[0]?.documentType ?? null;
      });
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

  const onKycUploaded = async (url: string) => {
    if (!activeType) return;
    setKycSaving(true);
    setKycMessage(null);
    try {
      await vendorsApi.uploadMyDocument({ type: activeType, url });
      setKycMessage(LABELS.kycDocumentUploaded);
      await loadChecklist();
    } catch (err) {
      setKycMessage(getApiErrorMessage(err, LABELS.couldNotUploadKycDocument));
    } finally {
      setKycSaving(false);
    }
  };

  return (
    <FormSection title={LABELS.kycChecklist} hint={LABELS.kycChecklistHint}>
      <p className="sm:col-span-2 text-[0.8125rem] text-ink-muted">
        {isComplete
          ? LABELS.kycChecklistComplete
          : LABELS.kycChecklistIncomplete}
      </p>
      {checklistError ? (
        <p className="sm:col-span-2 text-[0.8125rem] text-danger">
          {checklistError}
        </p>
      ) : null}
      {items.length === 0 && !checklistError ? (
        <p className="sm:col-span-2 text-[0.8125rem] text-ink-muted">
          {LABELS.noKycDocuments}
        </p>
      ) : null}
      <ul className="sm:col-span-2 space-y-2">
        {items.map((item) => (
          <li key={item.documentType}>
            <Button
              type="button"
              variant="outline"
              aria-pressed={activeType === item.documentType}
              onClick={() => setActiveType(item.documentType)}
              className={`h-auto min-h-0 max-h-none w-full justify-between gap-3 px-3 py-2 text-left text-[0.8125rem] font-normal ${
                activeType === item.documentType
                  ? "border-brand bg-brand-subtle/40 hover:bg-brand-subtle/40"
                  : "border-line"
              }`}
            >
              <span className="font-medium text-ink">
                {vendorDocumentTypeLabel(item.documentType)}
              </span>
              <span className="text-ink-muted">
                {vendorDocumentChecklistStatusLabel(item.status)}
              </span>
            </Button>
            {item.rejectionReason ? (
              <p className="mt-1 px-1 text-[0.75rem] text-danger">
                {LABELS.documentRejectionReason}: {item.rejectionReason}
              </p>
            ) : null}
            {item.documentId && item.url ? (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="mt-1 h-auto min-h-0 max-h-none px-1 py-0 text-[0.75rem] font-medium text-brand"
                onClick={() => void openKycDocument(item.documentId!)}
              >
                {LABELS.openDocument}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
      {activeType ? (
        <div className="sm:col-span-2">
          <FileUpload
            entityType={UPLOAD_ENTITY.VENDORS}
            entityId={vendorId}
            purpose={UPLOAD_PURPOSE.KYC}
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onUploaded={(url) => void onKycUploaded(url)}
            disabled={!vendorId || saving || kycSaving}
            label={`${LABELS.uploadKycDocument}: ${vendorDocumentTypeLabel(activeType)}`}
          />
        </div>
      ) : null}
      {kycMessage ? (
        <p
          className="sm:col-span-2 text-[0.8125rem] text-ink-muted"
          aria-live="polite"
        >
          {kycMessage}
        </p>
      ) : null}
    </FormSection>
  );
}
