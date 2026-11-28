"use client";

import { useState, useCallback, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import {
  taxApi,
  type TaxRuleFilters,
  type TaxRuleRow,
} from "../../api/tax/tax.api";
import { useTaxCategoryFocus } from "./useTaxCategoryFocus.hook";
import { useTaxRuleDialog } from "./useTaxRuleDialog.hook";
import { TaxRuleRowActions } from "../../components/tax/TaxRuleRowActions.component";
import {
  TaxRuleAppliesToCell,
  TaxRuleScopeCell,
} from "../../components/tax/TaxRuleCells.component";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";

const asRule = (row: AdminDataRow) => row as unknown as TaxRuleRow;

export function useAdminTaxPage() {
  const urlFilters = useUrlFilterParams<
    "search" | "gstTier" | "hasPriceBand" | "scope" | "categoryId"
  >({ search: ["q"] });
  const search = urlFilters.get("search");
  const gstTier = urlFilters.get("gstTier");
  const hasPriceBand = urlFilters.get("hasPriceBand");
  const scope = urlFilters.get("scope");
  const categoryId = urlFilters.get("categoryId");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [listVersion, setListVersion] = useState(0);

  // Filtering, counting and paging all happen on the server, so totals and later pages are right.
  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion;
      const filters: TaxRuleFilters = { page, limit };
      if (debouncedSearch) filters.search = debouncedSearch;
      if (gstTier) filters.gstPercentage = Number(gstTier);
      if (hasPriceBand === "YES" || hasPriceBand === "NO") {
        filters.hasBand = hasPriceBand;
      }
      if (scope === "default" || scope === "category") filters.scope = scope;
      if (categoryId) filters.categoryId = categoryId;
      return taxApi.getRules(filters);
    },
    [listVersion, debouncedSearch, gstTier, hasPriceBand, scope, categoryId],
  );

  const refresh = useCallback(
    () => setListVersion((version) => version + 1),
    [],
  );
  const handleDelete = useCallback(
    (rule: TaxRuleRow) =>
      taxApi.deleteRule(rule.id, { force: rule.isDefault }).then(refresh),
    [refresh],
  );

  const focus = useTaxCategoryFocus(categoryId, listVersion);
  const clearFocus = useCallback(
    () => urlFilters.clearAll(["categoryId"]),
    [urlFilters],
  );
  const {
    dialog,
    openCreate,
    openEdit,
    editFocusedRule,
    setFocusedCategoryRate,
  } = useTaxRuleDialog(focus, refresh);

  const actions = useCallback(
    (row: AdminDataRow): ReactNode => (
      <TaxRuleRowActions
        rule={asRule(row)}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    ),
    [openEdit, handleDelete],
  );

  const cellOverrides = {
    categoryName: (row: AdminDataRow) => (
      <TaxRuleScopeCell rule={asRule(row)} />
    ),
    appliesToCount: (row: AdminDataRow) => (
      <TaxRuleAppliesToCell rule={asRule(row)} />
    ),
  };

  const fetchDetail = useCallback(
    async (row: AdminDataRow) => ({ ...row }),
    [],
  );

  return {
    fetchDetail,
    filters: {
      search,
      gstTier,
      hasPriceBand,
      scope,
      onSearchChange: urlFilters.set("search"),
      onGstTierChange: urlFilters.set("gstTier"),
      onHasPriceBandChange: urlFilters.set("hasPriceBand"),
      onScopeChange: urlFilters.set("scope"),
      onClear: () =>
        urlFilters.clearAll([
          "search",
          "gstTier",
          "hasPriceBand",
          "scope",
          "categoryId",
        ]),
    },
    dialog,
    openCreate,
    focus: {
      status: focus.status,
      effective: focus.effective,
      ownRule: focus.ownRule,
      sourceText: focus.sourceText,
      onEditRule: editFocusedRule,
      onSetOwnRate: setFocusedCategoryRate,
      onClear: clearFocus,
    },
    title: LABELS.tax,
    permission: PERMISSIONS.TAX_MANAGE,
    load,
    actions,
    cellOverrides,
    columnKeys: [
      "categoryName",
      "appliesToCount",
      "hsnCode",
      "gstPercentage",
      "priceBandThreshold",
      "gstPercentageAbove",
      "createdAt",
    ],
  };
}
