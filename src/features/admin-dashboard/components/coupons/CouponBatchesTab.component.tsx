"use client";

import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { DataTable } from "@/shared/components/DataTable";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { useCouponBatches } from "../../hooks/coupons/useCouponBatches.hook";
import { buildCouponBatchColumns } from "../../constants/coupons/couponBatchColumns";
import { CouponBatchDetailDialog } from "./CouponsPageHeader/CouponBatchDetailDialog.component";
import { couponsPageHeaderStyles as styles } from "../../styles/coupons/couponsPageHeader.styles";

export function CouponBatchesTab() {
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const batches = useCouponBatches();
  const batchColumns = buildCouponBatchColumns();

  const filteredBatches = useMemo(() => {
    const list = batches.batches ?? [];
    if (!debouncedSearch) return list;
    const q = debouncedSearch.toLowerCase();
    return list.filter((b) => {
      const name = String(b.name ?? "").toLowerCase();
      const id = String(b.id ?? "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [batches.batches, debouncedSearch]);

  const activeCount = search.trim() ? 1 : 0;
  const handleClear = () => setSearch("");

  const closeBatchDetail = () => {
    setBatchDetail(null);
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
        showViewButton
        onRowClick={(row) => setBatchDetail(row)}
      />
      <CouponBatchDetailDialog
        batchDetail={batchDetail}
        onClose={closeBatchDetail}
      />
    </section>
  );
}
