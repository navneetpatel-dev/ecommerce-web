"use client";

import { useState, useCallback, type FormEvent, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { taxApi } from "@/features/admin-dashboard/api/tax.api";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { adminRowLabel } from "../utils/adminRowLabel";
import type { AdminDataRow } from "./useAdminDataList.hook";
import type { AdminListPageModel } from "../types/adminListPage.types";

export type AdminTaxPageModel = AdminListPageModel & {
  form: {
    gstPercentage: string;
    hsnCode: string;
    onGstChange: (value: string) => void;
    onHsnChange: (value: string) => void;
    onSubmit: (e: FormEvent) => Promise<void>;
  };
};

export function useAdminTaxPage(): AdminTaxPageModel {
  const [gstPercentage, setGstPercentage] = useState("18");
  const [hsnCode, setHsnCode] = useState("");
  const [listVersion, setListVersion] = useState(0);

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await taxApi.createRule({
        gstPercentage: Number(gstPercentage),
        hsnCode: hsnCode || undefined,
      });
      setHsnCode("");
      setGstPercentage("18");
      setListVersion((version) => version + 1);
    },
    [gstPercentage, hsnCode],
  );

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion;
      return taxApi.getRules({ page, limit });
    },
    [listVersion],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      return (
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteTaxTitle}
          description={formatLabel(LABELS.confirmDeleteTaxBody, { name })}
          onConfirm={() => taxApi.deleteRule(String(row.id)).then(reload)}
        />
      );
    },
    [],
  );

  return {
    form: {
      gstPercentage,
      hsnCode,
      onGstChange: setGstPercentage,
      onHsnChange: setHsnCode,
      onSubmit: handleCreate,
    },
    title: LABELS.tax,
    permission: PERMISSIONS.TAX_MANAGE,
    load,
    actions,
    columnKeys: ["categoryName", "hsnCode", "gstPercentage", "createdAt"],
  };
}
