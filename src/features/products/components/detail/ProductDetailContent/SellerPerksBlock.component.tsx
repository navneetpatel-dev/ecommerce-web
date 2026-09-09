import Link from "next/link";
import { RotateCcw, Shield, Truck } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { ProductDetail } from "@/shared/api/types";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "../../../styles/detail/productDetailContent.styles";

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
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.soldByCard}>
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.soldByText}>
            {LABELS.soldBy}{" "}
            <Link
              href={PATHS.vendorPage(product.vendor.slug)}
              className={PRODUCT_DETAIL_CONTENT_STYLES.soldByLink}
            >
              {product.vendor.businessName}
            </Link>
          </p>
        </div>
      ) : null}

      <div className={PRODUCT_DETAIL_CONTENT_STYLES.perksGrid}>
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.perkCard}>
          <Truck
            className={PRODUCT_DETAIL_CONTENT_STYLES.perkIcon}
            strokeWidth={1.75}
          />
          <div className={PRODUCT_DETAIL_CONTENT_STYLES.perkTextStack}>
            <p className={PRODUCT_DETAIL_CONTENT_STYLES.perkText}>
              {typeof freeShippingThreshold === "number"
                ? formatLabel(LABELS.freeDeliveryAbove, {
                    amount: formatInrAmount(freeShippingThreshold),
                  })
                : LABELS.deliveryAtCheckout}
            </p>
            {product.deliveryNote ? (
              <p className={PRODUCT_DETAIL_CONTENT_STYLES.perkText}>
                {product.deliveryNote}
              </p>
            ) : null}
          </div>
        </div>
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.perkCard}>
          <RotateCcw
            className={PRODUCT_DETAIL_CONTENT_STYLES.perkIcon}
            strokeWidth={1.75}
          />
          <div className={PRODUCT_DETAIL_CONTENT_STYLES.perkTextStack}>
            <p className={PRODUCT_DETAIL_CONTENT_STYLES.perkText}>
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
              <p className={PRODUCT_DETAIL_CONTENT_STYLES.perkText}>
                {product.returnShippingFee > 0
                  ? formatLabel(LABELS.returnShippingFeeAmount, {
                      amount: formatInrAmount(product.returnShippingFee),
                    })
                  : LABELS.returnShippingFree}
              </p>
            ) : null}
            {product.returnNote ? (
              <p className={PRODUCT_DETAIL_CONTENT_STYLES.perkText}>
                {product.returnNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {product.displayWarrantyMonths ? (
        <div className={PRODUCT_DETAIL_CONTENT_STYLES.perkCard}>
          <Shield
            className={PRODUCT_DETAIL_CONTENT_STYLES.perkIcon}
            strokeWidth={1.75}
          />
          <p className={PRODUCT_DETAIL_CONTENT_STYLES.perkText}>
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
