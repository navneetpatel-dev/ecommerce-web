"use client";

import { Pencil } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormError } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import {
  useEditCoupon,
  type UseEditCouponArgs,
} from "../../../hooks/coupons/useEditCoupon.hook";
import { editCouponActionStyles as styles } from "../../../styles/coupons/editCouponAction.styles";
import { CreateCouponForm } from "../CreateCouponForm/CreateCouponForm.component";

interface EditCouponActionProps extends UseEditCouponArgs {
  /** Vendor form: bearer fixed to the vendor, no platform-wide scope. */
  vendorMode?: boolean;
}

/** Row action: opens the coupon form prefilled with this coupon and saves the changes. */
export function EditCouponAction({
  vendorMode = false,
  ...args
}: EditCouponActionProps) {
  const edit = useEditCoupon(args);

  return (
    <Dialog open={edit.open} onOpenChange={edit.setOpen}>
      <RowActionButton
        kind="edit"
        icon={Pencil}
        label={LABELS.editCoupon}
        onClick={edit.handleOpen}
      />
      <DialogContent
        className={styles.dialogContent}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{edit.title}</DialogTitle>
        </DialogHeader>
        {edit.lockedHint ? (
          <p className={styles.lockedHint}>{edit.lockedHint}</p>
        ) : null}
        <form onSubmit={edit.onSubmit}>
          <CreateCouponForm
            form={edit.form}
            isPending={edit.isPending}
            vendorMode={vendorMode}
            vendorId={args.forceVendorId ?? null}
            submitLabel={LABELS.saveChanges}
            lockedFields={edit.lockedFields}
          />
          <FormError
            error={edit.formLevelError}
            fallback={LABELS.couldNotUpdateCoupon}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
