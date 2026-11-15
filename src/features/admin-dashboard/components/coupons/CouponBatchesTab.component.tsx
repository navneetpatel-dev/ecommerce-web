"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { DataTable } from "@/shared/components/DataTable";
import { TableRowAction } from "@/shared/components/DataTable/TableRowActions.component";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { useCouponBatches } from "../../hooks/coupons/useCouponBatches.hook";
import { buildCouponBatchColumns } from "../../constants/coupons/couponBatchColumns";
import { CouponBatchDetailDialog } from "./CouponsPageHeader/CouponBatchDetailDialog.component";
import { couponsPageHeaderStyles as styles } from "../../styles/coupons/couponsPageHeader.styles";

export function CouponBatchesTab() {
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);
  const batches = useCouponBatches();
  const batchColumns = buildCouponBatchColumns();

  const closeBatchDetail = () => {
    setBatchDetail(null);
  };

  const renderBatchActions = (row: CouponBatch) => {
    const openBatchDetail = () => {
      setBatchDetail(row);
    };

    return (
      <TableRowAction>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={openBatchDetail}
        >
          <Eye strokeWidth={2.25} aria-hidden />
          <span>{LABELS.view}</span>
        </Button>
      </TableRowAction>
    );
  };

  return (
    <section className={styles.batchesSection}>
      <DataTable
        title={LABELS.couponBatches}
        titleLevel={2}
        ariaLabel={LABELS.couponBatchesTableAria}
        columns={batchColumns}
        rows={batches.batches ?? []}
        loading={batches.isLoading}
        error={batches.isError ? LABELS.couldNotLoadData : undefined}
        onRefresh={batches.onRetry}
        emptyMessage={LABELS.noCouponBatches}
        getRowId={(row: CouponBatch) => row.id}
        actions={renderBatchActions}
      />
      <CouponBatchDetailDialog
        batchDetail={batchDetail}
        onClose={closeBatchDetail}
      />
    </section>
  );
}
