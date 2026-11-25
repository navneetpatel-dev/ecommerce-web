"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { useAdminReviewsPage } from "../../hooks/reviews/useAdminReviewsPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

const ALL = "__ALL__";

export function AdminReviewsPage() {
  const page = useAdminReviewsPage();
  const activeCount = [
    page.filters.search.trim(),
    page.filters.rating,
    page.filters.submission,
  ].filter(Boolean).length;

  return (
    <div className={adminPagesStyles.stack5}>
      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={page.filters.onClear}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame label={LABELS.search} htmlFor="reviews-filter-search">
            <Input
              id="reviews-filter-search"
              value={page.filters.search}
              onChange={(e) => page.filters.onSearchChange(e.target.value)}
              placeholder="Search by product, customer, or content..."
            />
          </FormFieldFrame>

          <FormFieldFrame label="Rating" htmlFor="reviews-filter-rating">
            <Select
              value={page.filters.rating || ALL}
              onValueChange={(v) =>
                page.filters.onRatingChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="reviews-filter-rating">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Ratings</SelectItem>
                {["5", "4", "3", "2", "1"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r} {r === "1" ? "Star" : "Stars"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame
            label="Submission"
            htmlFor="reviews-filter-submission"
          >
            <Select
              value={page.filters.submission || ALL}
              onValueChange={(v) =>
                page.filters.onSubmissionChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="reviews-filter-submission">
                <SelectValue placeholder="All Submissions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Submissions</SelectItem>
                <SelectItem value="NEW">New Review</SelectItem>
                <SelectItem value="EDIT">Edited Review</SelectItem>
                <SelectItem value="FLAGGED">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        fetchRowDetail={page.fetchDetail}
        columnKeys={page.columnKeys}
      />
    </div>
  );
}
