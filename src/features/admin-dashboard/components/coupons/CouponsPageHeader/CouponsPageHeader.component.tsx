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
import { Plus, Bell, Layers } from "lucide-react";
import { CreateCouponForm } from "../CreateCouponForm.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useNotifyCouponAlerts } from "../../../hooks/coupons/useNotifyCouponAlerts.hook";
import { BulkGenerateDialog } from "./BulkGenerateDialog.component";
import { couponsPageHeaderStyles as styles } from "../../../styles/coupons/couponsPageHeader.styles";

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
  const notifyAlerts = useNotifyCouponAlerts();

  const handleNotifyAlerts = () => notifyAlerts.mutate();
  const openBulkGenerate = () => setBulkOpen(true);

  const submitWithValidation = (data: CouponFormInput) => {
    onSubmit(data);
  };

  const handleInvalidSubmit = () => {
    void form.trigger();
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>{LABELS.coupons}</h1>
        <ButtonGroup>
          <Button
            type="button"
            size="sm"
            variant="outline"
            fullWidth="mobile"
            loading={notifyAlerts.isPending}
            onClick={handleNotifyAlerts}
          >
            <Bell aria-hidden /> {LABELS.runCouponAlerts}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            fullWidth="mobile"
            onClick={openBulkGenerate}
          >
            <Layers aria-hidden /> {LABELS.bulkGenerate}
          </Button>
          <BulkGenerateDialog open={bulkOpen} setOpen={setBulkOpen} />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" fullWidth="mobile">
                <Plus aria-hidden /> {LABELS.createCoupon}
              </Button>
            </DialogTrigger>
            <DialogContent
              className={styles.dialog}
              aria-describedby={undefined}
            >
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
    </div>
  );
}
