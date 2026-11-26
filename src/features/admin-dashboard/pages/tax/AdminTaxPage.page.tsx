"use client";

import { Plus } from "lucide-react";
import type { ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { TaxCategoryFocus } from "../../components/tax/TaxCategoryFocus.component";
import { TaxEffectiveLookup } from "../../components/tax/TaxEffectiveLookup.component";
import { TaxFilterSelects } from "../../components/tax/TaxFilterSelects.component";
import { TaxRuleDialog } from "../../components/tax/TaxRuleDialog.component";
import { useAdminTaxPage } from "../../hooks/tax/useAdminTaxPage";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { adminTaxStyles as styles } from "../../styles/tax/adminTax.styles";

export function AdminTaxPage() {
  const page = useAdminTaxPage();
  const { filters } = page;
  const activeCount = [
    filters.search.trim(),
    filters.gstTier,
    filters.hasPriceBand,
    filters.scope,
  ].filter(Boolean).length;
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) =>
    filters.onSearchChange(event.target.value);

  return (
    <div className={adminPagesStyles.stack5}>
      <div className={styles.headerActions}>
        <Button
          type="button"
          size="sm"
          fullWidth="mobile"
          onClick={page.openCreate}
        >
          <Plus aria-hidden />
          {LABELS.addTaxRule}
        </Button>
      </div>
      <TaxCategoryFocus {...page.focus} />
      <TaxRuleDialog {...page.dialog} />
      <TaxEffectiveLookup />

      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={filters.onClear}
      >
        <div className={styles.filterGrid}>
          <FormFieldFrame label={LABELS.search} htmlFor="tax-filter-search">
            <Input
              id="tax-filter-search"
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by HSN code, category, GST %..."
            />
          </FormFieldFrame>
          <TaxFilterSelects
            gstTier={filters.gstTier}
            hasPriceBand={filters.hasPriceBand}
            scope={filters.scope}
            onGstTierChange={filters.onGstTierChange}
            onHasPriceBandChange={filters.onHasPriceBandChange}
            onScopeChange={filters.onScopeChange}
          />
        </div>
      </CollapsibleTableFilters>

      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
        cellOverrides={page.cellOverrides}
        fetchRowDetail={page.fetchDetail}
      />
    </div>
  );
}
