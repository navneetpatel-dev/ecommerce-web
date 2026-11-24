"use client";

import { useState, useCallback, type FormEvent, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { taxApi } from "@/features/admin-dashboard/api/tax/tax.api";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminTaxPageModel = AdminListPageModel & {
  fetchDetail: (row: AdminDataRow) => Promise<Record<string, unknown>>;
  filters: {
    search: string;
    onSearchChange: (value: string) => void;
    onClear: () => void;
  };
  form: {
    gstPercentage: string;
    hsnCode: string;
    priceBandThreshold: string;
    gstPercentageAbove: string;
    createError: string | null;
    onGstChange: (value: string) => void;
    onHsnChange: (value: string) => void;
    onPriceBandThresholdChange: (value: string) => void;
    onGstPercentageAboveChange: (value: string) => void;
    onSubmit: (e: FormEvent) => Promise<void>;
  };
};

export function useAdminTaxPage(): AdminTaxPageModel {
  const [search, setSearch] = useState("");
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
      if (!search.trim()) return result;
      const q = search.trim().toLowerCase();
      const filtered = result.items.filter((item) => {
        const hsn = String(item.hsnCode ?? "").toLowerCase();
        const cat = String(item.categoryName ?? "").toLowerCase();
        const gst = String(item.gstPercentage ?? "");
        return hsn.includes(q) || cat.includes(q) || gst.includes(q);
      });
      return {
        ...result,
        items: filtered,
        total: filtered.length,
      };
    },
    [listVersion, search],
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
      onSearchChange: setSearch,
      onClear: () => setSearch(""),
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
