"use client";

import { useCallback } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { returnsApi } from "@/features/returns";
import { buildReturnRowActions } from "../utils/returnRowActions";
import type { AdminDataRow } from "./useAdminDataList.hook";
import type { AdminListPageModel } from "../types/adminListPage.types";

export function useAdminReturnsPage(): AdminListPageModel {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      returnsApi.listAdmin({ page, limit }),
    [],
  );

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void) =>
      buildReturnRowActions(row, reload),
    [],
  );

  return {
    title: LABELS.returnsRefunds,
    permission: PERMISSIONS.ORDER_REFUND,
    load,
    actions,
    columnKeys: [
      "productName",
      "customerName",
      "reasonCode",
      "type",
      "status",
      "refundStatus",
      "refundAmount",
      "creditNoteNumber",
      "debitNoteNumber",
      "createdAt",
    ],
  };
}
