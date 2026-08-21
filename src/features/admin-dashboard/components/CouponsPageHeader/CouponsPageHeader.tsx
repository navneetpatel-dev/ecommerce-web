"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { DataTable } from "@/shared/components/DataTable";
import { Plus } from "lucide-react";
import { CreateCouponForm } from "../CreateCouponForm";
import { adminApi } from "../../api/admin.api";
import { adminKeys } from "../../api/admin.queries";
import type { CouponFormInput } from "../../schemas/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { BulkGenerateDialog } from "./BulkGenerateDialog";
import { CouponBatchDetailDialog } from "./CouponBatchDetailDialog";
import { buildCouponBatchColumns } from "./couponBatchColumns";

interface CouponsPageHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CouponFormInput>;
  onSubmit: (data: CouponFormInput) => void;
  isPending: boolean;
}

export function CouponsPageHeader({
  open,
  setOpen,
  form,
  onSubmit,
  isPending,
}: CouponsPageHeaderProps) {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);

  const batchesQuery = useQuery({
    queryKey: adminKeys.couponBatches,
    queryFn: () => adminApi.couponBatches(),
  });

  const batchColumns = buildCouponBatchColumns();

  return (
    <div className="space-y-6">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]">
          {LABELS.coupons}
        </h2>
        <ButtonGroup>
          <BulkGenerateDialog open={bulkOpen} setOpen={setBulkOpen} />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" fullWidth="mobile">
                <Plus aria-hidden /> {LABELS.createCoupon}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{LABELS.createCoupon}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit, () => {
                  void form.trigger();
                })}
                className="space-y-1"
              >
                <CreateCouponForm form={form} isPending={isPending} />
              </form>
            </DialogContent>
          </Dialog>
        </ButtonGroup>
      </div>

      <section className="space-y-3">
        <h3 className="text-[1rem] font-semibold text-ink">
          {LABELS.couponBatches}
        </h3>
        <DataTable
          columns={batchColumns}
          rows={batchesQuery.data ?? []}
          loading={batchesQuery.isLoading}
          emptyMessage={LABELS.noCouponBatches}
          getRowId={(row) => row.id}
          actions={(row) => (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setBatchDetail(row)}
            >
              {LABELS.viewBatchCodes}
            </Button>
          )}
        />
      </section>

      <CouponBatchDetailDialog
        batchDetail={batchDetail}
        onClose={() => setBatchDetail(null)}
      />
    </div>
  );
}
