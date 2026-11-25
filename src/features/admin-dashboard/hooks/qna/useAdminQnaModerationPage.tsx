"use client";

import { useState, useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { productQnaApi } from "@/features/productQna";
import type { QnaModerationItem } from "@/features/productQna";
import { QnaModerationActions } from "../../components/qna/QnaModerationActions.component";
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

export type AdminQnaModerationPageModel = AdminListPageModel & {
  filters: {
    search: string;
    kind: string;
    submission: string;
    authorType: string;
    onSearchChange: (value: string) => void;
    onKindChange: (value: string) => void;
    onSubmissionChange: (value: string) => void;
    onAuthorTypeChange: (value: string) => void;
    onClear: () => void;
  };
};

/**
 * Q&A moderation: new questions and answers, and edits of published ones (the
 * live text keeps showing until an edit is approved; rejecting drops only the edit).
 */
export function useAdminQnaModerationPage(): AdminQnaModerationPageModel {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [submission, setSubmission] = useState("");
  const [authorType, setAuthorType] = useState("");

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      const result = await productQnaApi.moderationQueue({ page, limit });
      const mapped = result.items.map(toRow);
      const q = search.trim().toLowerCase();
      const filtered = mapped.filter((r) => {
        if (q) {
          const text = String(r.text ?? "").toLowerCase();
          const prod = String(r.productName ?? "").toLowerCase();
          const author = String(r.authorName ?? "").toLowerCase();
          if (!text.includes(q) && !prod.includes(q) && !author.includes(q)) {
            return false;
          }
        }
        if (kind && r.rawKind !== kind) return false;
        if (submission === "EDIT" && !r.isEdit) return false;
        if (submission === "NEW" && r.isEdit) return false;
        if (authorType && r.authorType !== authorType) return false;
        return true;
      });
      return {
        ...result,
        items: filtered,
        total: filtered.length,
      };
    },
    [search, kind, submission, authorType],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => (
      <QnaModerationActions row={row} reload={reload} />
    ),
    [],
  );

  const fetchDetail = useCallback(
    async (row: AdminDataRow) => row as unknown as Record<string, unknown>,
    [],
  );

  return {
    filters: {
      search,
      kind,
      submission,
      authorType,
      onSearchChange: setSearch,
      onKindChange: setKind,
      onSubmissionChange: setSubmission,
      onAuthorTypeChange: setAuthorType,
      onClear: () => {
        setSearch("");
        setKind("");
        setSubmission("");
        setAuthorType("");
      },
    },
    title: LABELS.adminQnaModerationTitle,
    permission: PERMISSIONS.REVIEW_MODERATE,
    load,
    actions,
    fetchDetail,
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
