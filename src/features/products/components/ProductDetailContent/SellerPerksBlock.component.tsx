import Link from "next/link";
import { RotateCcw, Shield, Truck } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import type { ProductDetail } from "@/shared/api/types";

interface SellerPerksBlockProps {
  product: ProductDetail;
  freeShippingThreshold?: number;
  returnWindowDays?: number | null;
  returnsAllowed?: boolean;
  warrantyTypeLabel: string;
}

export function SellerPerksBlock({
  product,
  freeShippingThreshold,
  returnWindowDays,
  returnsAllowed,
  warrantyTypeLabel,
}: SellerPerksBlockProps) {
  return (
    <>
      {product.vendor?.slug ? (
        <div className="rounded-lg border border-line bg-surface px-3 py-3">
          <p className="text-body-sm text-ink-muted">
            {LABELS.soldBy}{" "}
            <Link
              href={PATHS.vendorPage(product.vendor.slug)}
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              {product.vendor.businessName}
            </Link>
          </p>
        </div>
      ) : null}

      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3">
          <Truck
            className="mt-0.5 h-4 w-4 shrink-0 text-brand"
            strokeWidth={1.75}
          />
          <div className="space-y-1">
            <p className="text-body-sm leading-snug text-ink-muted">
              {typeof freeShippingThreshold === "number"
                ? formatLabel(LABELS.freeDeliveryAbove, {
                    amount: formatInrAmount(freeShippingThreshold),
                  })
                : LABELS.deliveryAtCheckout}
            </p>
            {product.deliveryNote ? (
              <p className="text-body-sm leading-snug text-ink-muted">
                {product.deliveryNote}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3">
          <RotateCcw
            className="mt-0.5 h-4 w-4 shrink-0 text-brand"
            strokeWidth={1.75}
          />
          <div className="space-y-1">
            <p className="text-body-sm leading-snug text-ink-muted">
              {returnsAllowed === false
                ? LABELS.notReturnable
                : typeof returnWindowDays === "number"
                  ? formatLabel(LABELS.easyReturnsDays, {
                      days: returnWindowDays,
                    })
                  : LABELS.returnsEligible}
            </p>
            {typeof product.returnShippingFee === "number" &&
            returnsAllowed !== false ? (
              <p className="text-body-sm leading-snug text-ink-muted">
                {product.returnShippingFee > 0
                  ? formatLabel(LABELS.returnShippingFeeAmount, {
                      amount: formatInrAmount(product.returnShippingFee),
                    })
                  : LABELS.returnShippingFree}
              </p>
            ) : null}
            {product.returnNote ? (
              <p className="text-body-sm leading-snug text-ink-muted">
                {product.returnNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {product.displayWarrantyMonths ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3">
          <Shield
            className="mt-0.5 h-4 w-4 shrink-0 text-brand"
            strokeWidth={1.75}
          />
          <p className="text-body-sm leading-snug text-ink-muted">
            {formatLabel(LABELS.warrantyMonthsLabel, {
              months: product.displayWarrantyMonths,
              type: warrantyTypeLabel,
            })}
          </p>
        </div>
      ) : null}
    </>
  );
}
