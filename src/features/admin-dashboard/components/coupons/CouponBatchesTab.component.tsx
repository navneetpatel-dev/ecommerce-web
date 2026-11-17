"use client";

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { DataTable } from "@/shared/components/DataTable";
import { TableRowAction } from "@/shared/components/DataTable/TableRowActions.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { useCouponBatches } from "../../hooks/coupons/useCouponBatches.hook";
import { buildCouponBatchColumns } from "../../constants/coupons/couponBatchColumns";
import { CouponBatchDetailDialog } from "./CouponsPageHeader/CouponBatchDetailDialog.component";
import { couponsPageHeaderStyles as styles } from "../../styles/coupons/couponsPageHeader.styles";

export function CouponBatchesTab() {
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);
  const [search, setSearch] = useState("");
  const batches = useCouponBatches();
  const batchColumns = buildCouponBatchColumns();

  const filteredBatches = useMemo(() => {
    const list = batches.batches ?? [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((b) => {
      const name = String(b.name ?? "").toLowerCase();
      const id = String(b.id ?? "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [batches.batches, search]);

  const activeCount = search.trim() ? 1 : 0;
  const handleClear = () => setSearch("");

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
      <CollapsibleTableFilters activeCount={activeCount} onClear={handleClear}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame
            label={LABELS.search}
            htmlFor="coupon-batches-filter-search"
          >
            <Input
              id="coupon-batches-filter-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon batches by name..."
            />
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <DataTable
        title={LABELS.couponBatches}
        titleLevel={2}
        ariaLabel={LABELS.couponBatchesTableAria}
        columns={batchColumns}
        rows={filteredBatches}
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
