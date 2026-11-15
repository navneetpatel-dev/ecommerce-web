"use client";

import { useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { reviewsApi, ReviewMediaModerationAction } from "@/features/reviews";
import type { Review, ReviewMediaItem } from "@/shared/api/types";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

/** A queue row: "New" or "Edit of approved" in words, plus a flag for the actions. */
function toModerationRow(
  review: Review & { submission?: string; flaggedReason?: string | null },
) {
  const isEdit = review.submission === "EDIT";
  const submission = review.flaggedReason
    ? `⚠️ Flagged: ${review.flaggedReason}`
    : isEdit
      ? LABELS.submissionEdit
      : LABELS.submissionNew;
  return {
    ...review,
    isEdit,
    submission,
  };
}

export function useAdminReviewsPage(): AdminListPageModel {
  // New reviews and edits of approved ones share the queue; an edit row shows
  // the proposed version, with the live text beside it ("Live version").
  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      const result = await reviewsApi.pending({ page, limit });
      return { ...result, items: result.items.map(toModerationRow) };
    },
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const isEdit = row.isEdit === true;
      const approveReview = () =>
        reviewsApi.approve(String(row.id)).then(reload);
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
                reviewsApi
                  .respond(String(row.id), { response: "" })
                  .then(reload)
              }
            />
          ) : null}
        </>
      );
    },
    [],
  );

  return {
    title: LABELS.reviews,
    permission: PERMISSIONS.REVIEW_MODERATE,
    load,
    actions,
    columnKeys: [
      "productName",
      "customerName",
      "submission",
      "rating",
      "title",
      "body",
      "previousBody",
      "vendorResponse",
      "createdAt",
    ],
  };
}
