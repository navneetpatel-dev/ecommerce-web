import { useCallback, useEffect, useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_DOCUMENT_CHECKLIST_STATUS } from "@/shared/constants/statuses";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import { vendorsApi, type KycChecklistItem } from "@/features/vendors";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

interface UseKycChecklistInput {
  vendorId: string;
  checklistKey: number;
}

export function useKycChecklist({
  vendorId,
  checklistKey,
}: UseKycChecklistInput) {
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

  const verifiedCount = useMemo(
    () =>
      items.filter(
        (item) => item.status === VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED,
      ).length,
    [items],
  );
  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const toggleRow = (documentType: VendorDocumentType) => {
    setActiveType((current) =>
      current === documentType ? null : documentType,
    );
  };

  return {
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
  };
}
