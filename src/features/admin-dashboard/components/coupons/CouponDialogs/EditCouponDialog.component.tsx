"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import type { Coupon } from "@/shared/api/types";
import { CreateCouponForm } from "../CreateCouponForm.component";
import { useEditCoupon } from "../../../hooks/coupons/useEditCoupon.hook";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import { couponDialogStyles as styles } from "../../../styles/coupons/couponDialogs.styles";

interface EditCouponDialogProps {
  coupon: Coupon;
  onClose: () => void;
  onSave: (values: CouponFormInput, coupon: Coupon) => Promise<unknown>;
  vendorMode?: boolean;
  vendorId?: string | null;
}

export function EditCouponDialog({
  coupon,
  onClose,
  onSave,
  vendorMode = false,
  vendorId = null,
}: EditCouponDialogProps) {
  const edit = useEditCoupon(coupon, onSave, onClose);
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };
  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className={styles.dialog} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{LABELS.editCoupon}</DialogTitle>
        </DialogHeader>
        {vendorMode ? <p>{LABELS.couponEditNeedsApproval}</p> : null}
        <form onSubmit={edit.onSubmit}>
          <CreateCouponForm
            form={edit.form}
            isPending={edit.isPending}
            vendorMode={vendorMode}
            vendorId={vendorId}
            submitLabel={LABELS.saveCoupon}
            editing
            lockCodeAndType={coupon.usedCount > 0}
          />
          <FormError
            error={edit.formLevelError}
            fallback={LABELS.couldNotSaveCoupon}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
