"use client";

import { useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { reviewsApi } from "@/features/reviews";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export function useAdminReviewsPage(): AdminListPageModel {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      reviewsApi.pending({ page, limit }),
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      return (
        <>
          <AdminConfirmAction
            label={LABELS.approve}
            dialogVariant="success"
            title={LABELS.confirmApproveReviewTitle}
            description={formatLabel(LABELS.confirmApproveReviewBody, { name })}
            onConfirm={() => reviewsApi.approve(String(row.id)).then(reload)}
          />
          <AdminConfirmAction
            label={LABELS.reject}
            dialogVariant="danger"
            title={LABELS.confirmRejectReviewTitle}
            description={formatLabel(LABELS.confirmRejectReviewBody, { name })}
            onConfirm={() => reviewsApi.reject(String(row.id)).then(reload)}
          />
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
      "rating",
      "title",
      "status",
      "createdAt",
    ],
  };
}
