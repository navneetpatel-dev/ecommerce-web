import { memo } from "react";
import { MapPin } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import type { Order } from "@/shared/api/types";
import { ORDER_SUMMARY_ASIDE_STYLES } from "../../styles/detail/orderSummaryAside.styles";

interface ShippingAddressBlockProps {
  address: NonNullable<Order["shippingAddress"]>;
}

export const ShippingAddressBlock = memo(function ShippingAddressBlock({
  address,
}: ShippingAddressBlockProps) {
  return (
    <div className={ORDER_SUMMARY_ASIDE_STYLES.shippingAddressContainer}>
      <div className={ORDER_SUMMARY_ASIDE_STYLES.shippingHeader}>
        <MapPin
          className={ORDER_SUMMARY_ASIDE_STYLES.shippingIcon}
          strokeWidth={1.5}
        />
        <TextEyebrow className={ORDER_SUMMARY_ASIDE_STYLES.shippingEyebrow}>
          {LABELS.shippingTo}
        </TextEyebrow>
      </div>
      <address className={ORDER_SUMMARY_ASIDE_STYLES.address}>
        <span className={ORDER_SUMMARY_ASIDE_STYLES.addressLineBlock}>
          {address.line1}
        </span>
        {address.line2 ? (
          <span className={ORDER_SUMMARY_ASIDE_STYLES.addressLineBlock}>
            {address.line2}
          </span>
        ) : null}
        <span className={ORDER_SUMMARY_ASIDE_STYLES.addressLineMuted}>
          {address.city}, {address.state} {address.pincode}
        </span>
        <span className={ORDER_SUMMARY_ASIDE_STYLES.addressLineMuted}>
          {address.country}
        </span>
      </address>
    </div>
  );
});
