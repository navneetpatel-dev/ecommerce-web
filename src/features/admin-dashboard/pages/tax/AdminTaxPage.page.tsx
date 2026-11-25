"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminTaxRuleForm } from "../../components/tax/AdminTaxRuleForm.component";
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
import { useAdminTaxPage } from "../../hooks/tax/useAdminTaxPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

const ALL = "__ALL__";

export function AdminTaxPage() {
  const page = useAdminTaxPage();
  const activeCount = [
    page.filters.search.trim(),
    page.filters.gstTier,
    page.filters.hasPriceBand,
  ].filter(Boolean).length;

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

          <FormFieldFrame label="GST Slab" htmlFor="tax-filter-gst">
            <Select
              value={page.filters.gstTier || ALL}
              onValueChange={(v) =>
                page.filters.onGstTierChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="tax-filter-gst">
                <SelectValue placeholder="All Slabs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Slabs</SelectItem>
                {["0", "5", "12", "18", "28"].map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}% GST
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame label="Price Band" htmlFor="tax-filter-band">
            <Select
              value={page.filters.hasPriceBand || ALL}
              onValueChange={(v) =>
                page.filters.onHasPriceBandChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="tax-filter-band">
                <SelectValue placeholder="All Rules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Rules</SelectItem>
                <SelectItem value="YES">Has Price Band</SelectItem>
                <SelectItem value="NO">Flat Rate Only</SelectItem>
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
        columnKeys={page.columnKeys}
        fetchRowDetail={page.fetchDetail}
      />
    </div>
  );
}
