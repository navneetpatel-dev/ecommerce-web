import { CircleX } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productQnaApi } from "@/features/productQna";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

const excerpt = (text: unknown) => {
  const value = String(text ?? "");
  return value.length > 60 ? `${value.slice(0, 60)}…` : value;
};

interface QnaModerationActionsProps {
  row: AdminDataRow;
  reload: () => void;
}

export function QnaModerationActions({
  row,
  reload,
}: QnaModerationActionsProps) {
  const id = String(row.id);
  const isEdit = row.isEdit === true;
  const isAnswer = row.rawKind === "ANSWER";
  const kind = String(row.kind).toLowerCase();
  const name = excerpt(row.text);
  const decide = (status: "PUBLISHED" | "REJECTED") => () =>
    (isAnswer
      ? productQnaApi.moderateAnswer(id, { status })
      : productQnaApi.moderate(id, { status })
    ).then(reload);

  return (
    <>
      <AdminConfirmAction
        label={LABELS.approve}
        dialogVariant="success"
        title={
          isEdit
            ? LABELS.confirmApproveEditTitle
            : formatLabel(LABELS.confirmApproveQnaTitle, { kind })
        }
        description={formatLabel(
          isEdit ? LABELS.confirmApproveEditBody : LABELS.confirmApproveQnaBody,
          { name },
        )}
        onConfirm={decide("PUBLISHED")}
      />
      <AdminConfirmAction
        label={LABELS.reject}
        icon={CircleX}
        dialogVariant="danger"
        requireReason
        reasonLabel={LABELS.rejectionNote}
        reasonHint={LABELS.enterRejectionNote}
        title={
          isEdit
            ? LABELS.confirmRejectEditTitle
            : formatLabel(LABELS.confirmRejectQnaTitle, { kind })
        }
        description={formatLabel(
          isEdit ? LABELS.confirmRejectEditBody : LABELS.confirmRejectQnaBody,
          { name },
        )}
        onConfirm={decide("REJECTED")}
      />
    </>
  );
}
