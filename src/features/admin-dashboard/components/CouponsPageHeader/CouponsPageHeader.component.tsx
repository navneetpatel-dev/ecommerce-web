"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { DataTable } from "@/shared/components/DataTable.component";
import { Plus } from "lucide-react";
import { CreateCouponForm } from "../CreateCouponForm.component";
import type { CouponFormInput } from "../../schemas/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import type { CouponBatch } from "@/shared/api/types";
import { useCouponBatches } from "../../hooks/useCouponBatches.hook";
import { BulkGenerateDialog } from "./BulkGenerateDialog.component";
import { CouponBatchDetailDialog } from "./CouponBatchDetailDialog.component";
import { buildCouponBatchColumns } from "./couponBatchColumns";
import { couponsPageHeaderStyles as styles } from "./couponsPageHeader.styles";

interface CouponsPageHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CouponFormInput>;
  onSubmit: (data: CouponFormInput) => void;
  isPending: boolean;
}

export function CouponsPageHeader(props: CouponsPageHeaderProps) {
  const { open, setOpen, form, onSubmit, isPending } = props;
  const [bulkOpen, setBulkOpen] = useState(false);
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);
  const batches = useCouponBatches();

  const batchColumns = buildCouponBatchColumns();

  const submitWithValidation = (data: CouponFormInput) => {
    onSubmit(data);
  };

  const handleInvalidSubmit = () => {
    void form.trigger();
  };

  const openBatchDetail = (row: CouponBatch) => {
    setBatchDetail(row);
    return null;
  };

  const closeBatchDetail = () => {
    setBatchDetail(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>{LABELS.coupons}</h2>
        <ButtonGroup>
          <BulkGenerateDialog open={bulkOpen} setOpen={setBulkOpen} />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" fullWidth="mobile">
                <Plus aria-hidden /> {LABELS.createCoupon}
              </Button>
            </DialogTrigger>
            <DialogContent className={styles.dialog}>
              <DialogHeader>
                <DialogTitle>{LABELS.createCoupon}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(
                  submitWithValidation,
                  handleInvalidSubmit,
                )}
                className={styles.form}
              >
                <CreateCouponForm form={form} isPending={isPending} />
              </form>
            </DialogContent>
          </Dialog>
        </ButtonGroup>
      </div>

      <section className={styles.batchesSection}>
        <h3 className={styles.batchesHeading}>{LABELS.couponBatches}</h3>
        <DataTable
          columns={batchColumns}
          rows={batches.batches ?? []}
          loading={batches.isLoading}
          error={batches.isError ? LABELS.couldNotLoadData : undefined}
          onRefresh={batches.onRetry}
          emptyMessage={LABELS.noCouponBatches}
          getRowId={(row: CouponBatch) => row.id}
          actions={openBatchDetail}
        />
      </section>

      <CouponBatchDetailDialog
        batchDetail={batchDetail}
        onClose={closeBatchDetail}
      />
    </div>
  );
}
