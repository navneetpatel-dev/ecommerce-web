"use client";

import { useCallback } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { returnsApi } from "@/features/returns";
import { buildReturnRowActions } from "../../utils/returns/returnRowActions";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

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
