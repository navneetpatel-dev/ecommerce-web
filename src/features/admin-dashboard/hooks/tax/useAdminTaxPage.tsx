"use client";

import { useState, useCallback, type FormEvent, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useUrlFilterParams } from "@/shared/hooks/navigation/useUrlFilterParams.hook";
import { taxApi } from "@/features/admin-dashboard/api/tax/tax.api";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import { filterTaxRules } from "../../utils/tax/taxFilters.utils";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";

export function useAdminTaxPage() {
  const urlFilters = useUrlFilterParams<"search" | "gstTier" | "hasPriceBand">({
    search: ["q"],
  });
  const search = urlFilters.get("search");
  const gstTier = urlFilters.get("gstTier");
  const hasPriceBand = urlFilters.get("hasPriceBand");
  const [gstPercentage, setGstPercentage] = useState("18");
  const [hsnCode, setHsnCode] = useState("");
  // Optional per-piece price band: above this value, the higher GST % applies.
  const [priceBandThreshold, setPriceBandThreshold] = useState("");
  const [gstPercentageAbove, setGstPercentageAbove] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [listVersion, setListVersion] = useState(0);

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setCreateError(null);
      try {
        const hasBand = priceBandThreshold !== "" && gstPercentageAbove !== "";
        await taxApi.createRule({
          gstPercentage: Number(gstPercentage),
          hsnCode: hsnCode || undefined,
          priceBandThreshold: hasBand ? Number(priceBandThreshold) : null,
          gstPercentageAbove: hasBand ? Number(gstPercentageAbove) : null,
        });
        setHsnCode("");
        setGstPercentage("18");
        setPriceBandThreshold("");
        setGstPercentageAbove("");
        setListVersion((version) => version + 1);
      } catch (err) {
        setCreateError(getApiErrorMessage(err, LABELS.couldNotCreateTaxRule));
      }
    },
    [gstPercentage, hsnCode, priceBandThreshold, gstPercentageAbove],
  );

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion;
      const result = await taxApi.getRules({ page, limit });
      const filtered = filterTaxRules(
        result.items,
        search,
        gstTier,
        hasPriceBand,
      );
      return { ...result, items: filtered, total: filtered.length };
    },
    [listVersion, search, gstTier, hasPriceBand],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const deleteRule = () => taxApi.deleteRule(String(row.id)).then(reload);

      const name = adminRowLabel(row);
      return (
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteTaxTitle}
          description={formatLabel(LABELS.confirmDeleteTaxBody, { name })}
          onConfirm={deleteRule}
        />
      );
    },
    [],
  );

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
      onSearchChange: urlFilters.set("search"),
      onGstTierChange: urlFilters.set("gstTier"),
      onHasPriceBandChange: urlFilters.set("hasPriceBand"),
      onClear: () => urlFilters.clearAll(["search", "gstTier", "hasPriceBand"]),
    },
    form: {
      gstPercentage,
      hsnCode,
      priceBandThreshold,
      gstPercentageAbove,
      createError,
      onGstChange: setGstPercentage,
      onHsnChange: setHsnCode,
      onPriceBandThresholdChange: setPriceBandThreshold,
      onGstPercentageAboveChange: setGstPercentageAbove,
      onSubmit: handleCreate,
    },
    title: LABELS.tax,
    permission: PERMISSIONS.TAX_MANAGE,
    load,
    actions,
    columnKeys: [
      "categoryName",
      "hsnCode",
      "gstPercentage",
      "priceBandThreshold",
      "gstPercentageAbove",
      "createdAt",
    ],
  };
}
