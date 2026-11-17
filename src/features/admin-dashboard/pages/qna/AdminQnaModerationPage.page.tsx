"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { useAdminQnaModerationPage } from "../../hooks/qna/useAdminQnaModerationPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

/** New and edited questions and answers awaiting a moderator's decision. */
export function AdminQnaModerationPage() {
  const page = useAdminQnaModerationPage();
  const activeCount = page.filters.search.trim() ? 1 : 0;

  return (
    <div className={adminPagesStyles.stack5}>
      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={page.filters.onClear}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame label={LABELS.search} htmlFor="qna-filter-search">
            <Input
              id="qna-filter-search"
              value={page.filters.search}
              onChange={(e) => page.filters.onSearchChange(e.target.value)}
              placeholder="Search by question, answer, product..."
            />
          </FormFieldFrame>
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
