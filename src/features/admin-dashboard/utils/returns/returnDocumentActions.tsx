import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { returnsApi } from "@/features/returns";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

/** Credit/debit note downloads for an admin return row, when the documents exist. */
export function buildReturnDocumentActions(row: AdminDataRow): ReactNode[] {
  const buttons: ReactNode[] = [];
  const handleDownloadCreditNote = () => {
    void returnsApi
      .downloadCreditNote(String(row.id))
      .catch((error: unknown) => {
        notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
      });
  };

  const handleDownloadDebitNote = () => {
    void returnsApi
      .downloadDebitNote(String(row.id))
      .catch((error: unknown) => {
        notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
      });
  };

  if (row.creditNoteNumber) {
    buttons.push(
      <Button
        key="cn"
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadCreditNote}
      >
        {LABELS.downloadCreditNote}
      </Button>,
    );
  }
  if (row.debitNoteNumber) {
    buttons.push(
      <Button
        key="dn"
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadDebitNote}
      >
        {LABELS.downloadDebitNote}
      </Button>,
    );
  }
  return buttons;
}
