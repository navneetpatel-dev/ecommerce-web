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
import { TableRowAction } from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { Plus, Bell, Eye } from "lucide-react";
import { CreateCouponForm } from "../CreateCouponForm.component";
import { FormError } from "@/shared/components/FormError.component";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { CouponBatch } from "@/shared/api/types";
import { useCouponBatches } from "../../../hooks/coupons/useCouponBatches.hook";
import { useNotifyCouponAlerts } from "../../../hooks/coupons/useNotifyCouponAlerts.hook";
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
  formLevelError?: string | null;
}

export function CouponsPageHeader(props: CouponsPageHeaderProps) {
  const {
    open,
    setOpen,
    form,
    onSubmit,
    isPending,
    formLevelError = null,
  } = props;
  const [bulkOpen, setBulkOpen] = useState(false);
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);
  const batches = useCouponBatches();
  const notifyAlerts = useNotifyCouponAlerts();

  const batchColumns = buildCouponBatchColumns();

  const submitWithValidation = (data: CouponFormInput) => {
    onSubmit(data);
  };

  const handleInvalidSubmit = () => {
    void form.trigger();
  };

  const renderBatchActions = (row: CouponBatch) => (
    <TableRowAction>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={tableMenuButtonClass("neutral")}
        onClick={() => setBatchDetail(row)}
      >
        <Eye strokeWidth={2.25} aria-hidden />
        <span>{LABELS.view}</span>
      </Button>
    </TableRowAction>
  );

  const closeBatchDetail = () => {
    setBatchDetail(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>{LABELS.coupons}</h2>
        <ButtonGroup>
          <Button
            type="button"
            size="sm"
            variant="outline"
            fullWidth="mobile"
            loading={notifyAlerts.isPending}
            onClick={() => notifyAlerts.mutate()}
          >
            <Bell aria-hidden /> {LABELS.runCouponAlerts}
          </Button>
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
                <FormError
                  error={formLevelError}
                  fallback={LABELS.couldNotCreateCoupon}
                />
              </form>
            </DialogContent>
          </Dialog>
        </ButtonGroup>
      </div>

      {notifyAlerts.isSuccess ? (
        <p className={styles.statusMuted} aria-live="polite">
          {(notifyAlerts.data?.notified ?? 0) > 0
            ? formatLabel(LABELS.couponAlertsSent, {
                count: String(notifyAlerts.data?.notified ?? 0),
              })
            : LABELS.couponAlertsNoneSent}
        </p>
      ) : null}
      {notifyAlerts.isError ? (
        <p className={styles.statusError} role="alert">
          {LABELS.couponAlertsFailed}
        </p>
      ) : null}

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
          actions={renderBatchActions}
        />
      </section>

      <CouponBatchDetailDialog
        batchDetail={batchDetail}
        onClose={closeBatchDetail}
      />
    </div>
  );
}
