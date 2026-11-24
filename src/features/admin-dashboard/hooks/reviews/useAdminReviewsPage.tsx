"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { reviewsApi } from "@/features/reviews";
import type { Review } from "@/shared/api/types";
import { ReviewModerationActions } from "../../components/reviews/ReviewModerationActions.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

/** A queue row: "New" or "Edit of approved" in words, plus a flag for the actions. */
function toModerationRow(
  review: Review & {
    submission?: string;
    flaggedReason?: string | null;
    product?: { name?: string };
    user?: { name?: string };
    productName?: string;
    customerName?: string;
  },
) {
  const isEdit = review.submission === "EDIT";
  const submission = review.flaggedReason
    ? `⚠️ Flagged: ${review.flaggedReason}`
    : isEdit
      ? LABELS.submissionEdit
      : LABELS.submissionNew;
  return {
    ...review,
    productName: review.productName ?? review.product?.name ?? "—",
    customerName: review.customerName ?? review.user?.name ?? "—",
    isEdit,
    submission,
  };
}

export type AdminReviewsPageModel = AdminListPageModel & {
  filters: {
    search: string;
    onSearchChange: (value: string) => void;
    onClear: () => void;
  };
};

export function useAdminReviewsPage(): AdminReviewsPageModel {
  const searchParams = useSearchParams();
  const paramSearch =
    searchParams.get("search") ??
    searchParams.get("q") ??
    searchParams.get("product") ??
    "";
  const [userSearch, setUserSearch] = useState<string | null>(null);
  const search = userSearch ?? paramSearch;

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      const result = await reviewsApi.pending({ page, limit });
      const mapped = result.items.map(toModerationRow);
      if (!search.trim()) return { ...result, items: mapped };
      const q = search.trim().toLowerCase();
      const filtered = mapped.filter((r) => {
        const prod = String(r.productName ?? "").toLowerCase();
        const cust = String(r.customerName ?? "").toLowerCase();
        const title = String(r.title ?? "").toLowerCase();
        const body = String(r.body ?? "").toLowerCase();
        return (
          prod.includes(q) ||
          cust.includes(q) ||
          title.includes(q) ||
          body.includes(q)
        );
      });
      return {
        ...result,
        items: filtered,
        total: filtered.length,
      };
    },
    [search],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => (
      <ReviewModerationActions row={row} reload={reload} />
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
      onSearchChange: setUserSearch,
      onClear: () => setUserSearch(""),
    },
    title: LABELS.reviews,
    permission: PERMISSIONS.REVIEW_MODERATE,
    load,
    actions,
    fetchDetail,
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
