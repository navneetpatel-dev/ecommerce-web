import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
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
      <RowActionButton
        key="cn"
        icon={Download}
        label={LABELS.downloadCreditNote}
        onClick={handleDownloadCreditNote}
      />,
    );
  }
  if (row.debitNoteNumber) {
    buttons.push(
      <RowActionButton
        key="dn"
        icon={Download}
        label={LABELS.downloadDebitNote}
        onClick={handleDownloadDebitNote}
      />,
    );
  }
  return buttons;
}
