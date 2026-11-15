"use client";

import { useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productQnaApi } from "@/features/productQna";
import type { QnaModerationItem } from "@/features/productQna";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

/** Words for the table; the raw kind / submission stay on the row for the actions. */
function toRow(item: QnaModerationItem) {
  const isVendor = item.authorType === "VENDOR";
  const authorBadge = isVendor
    ? item.vendorName
      ? `${item.authorName} (Verified Seller: ${item.vendorName})`
      : `${item.authorName} (Verified Seller)`
    : item.authorName;

  return {
    ...item,
    rawKind: item.kind,
    isEdit: item.submission === "EDIT",
    kind:
      item.kind === "ANSWER" ? LABELS.qnaKindAnswer : LABELS.qnaKindQuestion,
    submission:
      item.submission === "EDIT" ? LABELS.submissionEdit : LABELS.submissionNew,
    authorName: authorBadge,
  };
}

const excerpt = (text: unknown) => {
  const value = String(text ?? "");
  return value.length > 60 ? `${value.slice(0, 60)}…` : value;
};

/**
 * Q&A moderation: new questions and answers, and edits of published ones (the
 * live text keeps showing until an edit is approved; rejecting drops only the edit).
 */
export function useAdminQnaModerationPage(): AdminListPageModel {
  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      const result = await productQnaApi.moderationQueue({ page, limit });
      return { ...result, items: result.items.map(toRow) };
    },
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
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
              isEdit
                ? LABELS.confirmApproveEditBody
                : LABELS.confirmApproveQnaBody,
              { name },
            )}
            onConfirm={decide("PUBLISHED")}
          />
          <AdminConfirmAction
            label={LABELS.reject}
            dialogVariant="danger"
            title={
              isEdit
                ? LABELS.confirmRejectEditTitle
                : formatLabel(LABELS.confirmRejectQnaTitle, { kind })
            }
            description={formatLabel(
              isEdit
                ? LABELS.confirmRejectEditBody
                : LABELS.confirmRejectQnaBody,
              { name },
            )}
            onConfirm={decide("REJECTED")}
          />
        </>
      );
    },
    [],
  );

  return {
    title: LABELS.adminQnaModerationTitle,
    permission: PERMISSIONS.REVIEW_MODERATE,
    load,
    actions,
    columnKeys: [
      "productName",
      "authorName",
      "kind",
      "submission",
      "text",
      "previousText",
      "questionText",
      "submittedAt",
    ],
  };
}
