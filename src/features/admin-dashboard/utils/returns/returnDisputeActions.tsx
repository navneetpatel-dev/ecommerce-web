import { Gavel, CircleX } from "lucide-react";
import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { returnsApi } from "@/features/returns";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

/** Vendor return dispute adjudication actions (uphold / reject) for admin. */
export function buildReturnDisputeActions(
  row: AdminDataRow,
  reload: () => void,
): ReactNode[] {
  if (row.disputeStatus !== "PENDING") return [];

  const disputeReason =
    String(row.disputeReason ?? "") || LABELS.returnReasonDamaged;

  return [
    <AdminConfirmAction
      key="uphold-dispute"
      label={LABELS.upholdDispute}
      icon={Gavel}
      dialogVariant="warning"
      title={LABELS.upholdDisputeTitle}
      description={formatLabel(LABELS.upholdDisputeBody, {
        reason: disputeReason,
      })}
      requireReason
      onConfirm={(notes) =>
        returnsApi
          .resolveDispute(String(row.id), {
            resolution: "UPHELD",
            notes: notes ?? LABELS.upholdDisputeDefaultNotes,
          })
          .then(reload)
      }
    />,
    <AdminConfirmAction
      key="reject-dispute"
      label={LABELS.rejectDispute}
      icon={CircleX}
      dialogVariant="danger"
      title={LABELS.rejectDisputeTitle}
      description={LABELS.rejectDisputeBody}
      requireReason
      onConfirm={(notes) =>
        returnsApi
          .resolveDispute(String(row.id), {
            resolution: "REJECTED",
            notes: notes ?? LABELS.rejectDisputeDefaultNotes,
          })
          .then(reload)
      }
    />,
  ];
}
