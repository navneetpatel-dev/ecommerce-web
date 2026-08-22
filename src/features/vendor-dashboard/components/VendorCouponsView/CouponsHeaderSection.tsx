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
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { UseFormReturn } from "react-hook-form";

interface CouponsHeaderSectionProps {
  absorbedDiscountTotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CouponFormInput>;
  isPending: boolean;
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
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h2 className="text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]">
          {LABELS.coupons}
        </h2>
        <p className="text-[0.875rem] text-ink-muted">
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
          <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
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
            </form>
          </DialogContent>
        </Dialog>
      </ButtonGroup>
    </div>
  );
}
