"use client";

import { useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { productQnaApi } from "@/features/productQna";
import type { QnaModerationItem } from "@/features/productQna";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
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
  const urlFilters = useUrlFilterParams<
    "search" | "kind" | "submission" | "authorType"
  >({ search: ["q"] });
  const search = urlFilters.get("search");
  const kind = urlFilters.get("kind");
  const submission = urlFilters.get("submission");
  const authorType = urlFilters.get("authorType");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      const result = await productQnaApi.moderationQueue({ page, limit });
      const mapped = result.items.map(toRow);
      const q = debouncedSearch.toLowerCase();
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
    [debouncedSearch, kind, submission, authorType],
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
      onSearchChange: urlFilters.set("search"),
      onKindChange: urlFilters.set("kind"),
      onSubmissionChange: urlFilters.set("submission"),
      onAuthorTypeChange: urlFilters.set("authorType"),
      onClear: () =>
        urlFilters.clearAll(["search", "kind", "submission", "authorType"]),
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
