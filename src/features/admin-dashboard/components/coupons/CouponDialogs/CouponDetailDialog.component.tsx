"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { Coupon } from "@/shared/api/types";
import {
  couponRestrictionLabel,
  couponScopeLabel,
  couponTypeLabel,
  couponValueLabel,
} from "../../../utils/coupons/couponSummary";
import { couponDialogStyles as styles } from "../../../styles/coupons/couponDialogs.styles";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.detailRow}>
      <dt className={styles.detailLabel}>{label}</dt>
      <dd className={styles.detailValue}>{value}</dd>
    </div>
  );
}

export function CouponDetailDialog({
  coupon,
  onClose,
}: {
  coupon: Coupon | null;
  onClose: () => void;
}) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };
  return (
    <Dialog open={Boolean(coupon)} onOpenChange={handleOpenChange}>
      <DialogContent className={styles.dialog} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{coupon?.code}</DialogTitle>
        </DialogHeader>
        {coupon ? (
          <dl className={styles.detailList}>
            <Row
              label={LABELS.status}
              value={<StatusBadge status={coupon.status} />}
            />
            {coupon.rejectionNote ? (
              <Row
                label={LABELS.rejectionReason}
                value={coupon.rejectionNote}
              />
            ) : null}
            <Row label={LABELS.couponType} value={couponTypeLabel(coupon)} />
            <Row label={LABELS.couponValue} value={couponValueLabel(coupon)} />
            <Row
              label={LABELS.maxDiscountCap}
              value={
                coupon.maxDiscountCap == null
                  ? "—"
                  : formatInr(coupon.maxDiscountCap)
              }
            />
            <Row
              label={LABELS.minOrderValue}
              value={
                coupon.minOrderValue == null
                  ? "—"
                  : formatInr(coupon.minOrderValue)
              }
            />
            <Row label={LABELS.minQuantity} value={coupon.minQuantity ?? "—"} />
            <Row
              label={LABELS.applicableScope}
              value={couponScopeLabel(coupon)}
            />
            <Row
              label={LABELS.userRestriction}
              value={couponRestrictionLabel(coupon)}
            />
            <Row
              label={LABELS.usageLimitTotal}
              value={coupon.usageLimitTotal ?? LABELS.usageUnlimited}
            />
            <Row
              label={LABELS.usageLimitPerUser}
              value={coupon.usageLimitPerUser ?? LABELS.usageUnlimited}
            />
            <Row
              label={LABELS.showInOffers}
              value={coupon.showInOffers === false ? LABELS.no : LABELS.yes}
            />
            <Row
              label={LABELS.stackable}
              value={coupon.stackable ? LABELS.yes : LABELS.no}
            />
            <Row
              label={LABELS.startDate}
              value={formatDateTime(coupon.startDate)}
            />
            <Row
              label={LABELS.endDate}
              value={formatDateTime(coupon.endDate)}
            />
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
