"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminTaxRuleForm } from "../../components/tax/AdminTaxRuleForm.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { useAdminTaxPage } from "../../hooks/tax/useAdminTaxPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminTaxPage() {
  const page = useAdminTaxPage();
  const activeCount = page.filters.search.trim() ? 1 : 0;

  return (
    <div className={adminPagesStyles.stack5}>
      <AdminTaxRuleForm {...page.form} />

      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={page.filters.onClear}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame label={LABELS.search} htmlFor="tax-filter-search">
            <Input
              id="tax-filter-search"
              value={page.filters.search}
              onChange={(e) => page.filters.onSearchChange(e.target.value)}
              placeholder="Search by HSN code, category, GST %..."
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
        fetchRowDetail={page.fetchDetail}
      />
    </div>
  );
}
