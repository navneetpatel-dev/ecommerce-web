"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { useAdminReviewsPage } from "../../hooks/reviews/useAdminReviewsPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminReviewsPage() {
  const page = useAdminReviewsPage();
  const activeCount = page.filters.search.trim() ? 1 : 0;

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

          {activeCount > 0 && (
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={page.filters.onClear}
              >
                {LABELS.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </CollapsibleTableFilters>

      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
      />
    </div>
  );
}
