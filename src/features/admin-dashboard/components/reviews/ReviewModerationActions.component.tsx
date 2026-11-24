import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { reviewsApi, ReviewMediaModerationAction } from "@/features/reviews";
import type { ReviewMediaItem } from "@/shared/api/types";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

interface ReviewModerationActionsProps {
  row: AdminDataRow;
  reload: () => void;
}

export function ReviewModerationActions({
  row,
  reload,
}: ReviewModerationActionsProps) {
  const name = adminRowLabel(row);
  const isEdit = row.isEdit === true;
  const approveReview = () => reviewsApi.approve(String(row.id)).then(reload);
  const rejectReview = () => reviewsApi.reject(String(row.id)).then(reload);

  return (
    <>
      <ReviewMediaModerationAction
        media={row.media as ReviewMediaItem[] | undefined}
      />
      <AdminConfirmAction
        label={LABELS.approve}
        dialogVariant="success"
        title={
          isEdit
            ? LABELS.confirmApproveEditTitle
            : LABELS.confirmApproveReviewTitle
        }
        description={formatLabel(
          isEdit
            ? LABELS.confirmApproveEditBody
            : LABELS.confirmApproveReviewBody,
          { name },
        )}
        onConfirm={approveReview}
      />
      <AdminConfirmAction
        label={LABELS.reject}
        dialogVariant="danger"
        title={
          isEdit
            ? LABELS.confirmRejectEditTitle
            : LABELS.confirmRejectReviewTitle
        }
        description={formatLabel(
          isEdit
            ? LABELS.confirmRejectEditBody
            : LABELS.confirmRejectReviewBody,
          { name },
        )}
        onConfirm={rejectReview}
      />
      {row.vendorResponse ? (
        <AdminConfirmAction
          label={LABELS.clearSellerResponse}
          dialogVariant="danger"
          title={LABELS.removeSellerResponse}
          description={formatLabel(LABELS.confirmRemoveSellerResponseBody, {
            name,
          })}
          onConfirm={() =>
            reviewsApi.respond(String(row.id), { response: "" }).then(reload)
          }
        />
      ) : null}
    </>
  );
}
