"use client";

import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  CreateCouponForm,
  type CouponFormInput,
} from "@/features/admin-dashboard";
import { LABELS } from "@/shared/constants/labels";
import { FormError } from "@/shared/components/FormError.component";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { UseFormReturn } from "react-hook-form";
import { couponsHeaderSectionStyles } from "../../../styles/coupons/vendorCouponsView.styles";

interface CouponsHeaderSectionProps {
  absorbedDiscountTotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CouponFormInput>;
  isPending: boolean;
  formLevelError?: string | null;
  onSubmit: (data: CouponFormInput) => void;
  vendorId?: string | null;
}

/** Heading + absorbed-discounts summary + create-coupon dialog (Rule 3). */
export function CouponsHeaderSection(props: CouponsHeaderSectionProps) {
  const {
    absorbedDiscountTotal,
    open,
    setOpen,
    form,
    isPending,
    formLevelError = null,
    onSubmit,
    vendorId = null,
  } = props;

  const summaryCopy = formatLabel(LABELS.absorbedDiscountsSummary, {
    amount: formatInrAmount(absorbedDiscountTotal),
  });

  const handleInvalidSubmit = () => {
    void form.trigger();
  };

  return (
    <div className={couponsHeaderSectionStyles.header}>
      <div className={couponsHeaderSectionStyles.titleGroup}>
        <h2 className={couponsHeaderSectionStyles.heading}>{LABELS.coupons}</h2>
        <p className={couponsHeaderSectionStyles.summary}>
          {summaryCopy} ({LABELS.absorbedThisPeriod})
        </p>
      </div>
      <ButtonGroup>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            type="button"
            size="sm"
            fullWidth="mobile"
            onClick={() => setOpen(true)}
          >
            <Plus aria-hidden /> {LABELS.createVendorCoupon}
          </Button>
          <DialogContent className={couponsHeaderSectionStyles.dialogContent}>
            <DialogHeader>
              <DialogTitle>{LABELS.createVendorCoupon}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}>
              <CreateCouponForm
                form={form}
                isPending={isPending}
                vendorMode
                vendorId={vendorId}
              />
              <FormError
                error={formLevelError}
                fallback={LABELS.couldNotCreateCoupon}
              />
            </form>
          </DialogContent>
        </Dialog>
      </ButtonGroup>
    </div>
  );
}
