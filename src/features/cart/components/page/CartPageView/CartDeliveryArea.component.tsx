"use client";

import { DeliveryPincodeChip } from "@/shared/components/delivery/DeliveryPincodeChip.component";
import { DeliveryServiceabilityNotice } from "@/shared/components/delivery/DeliveryServiceabilityNotice.component";
import {
  UNKNOWN_DELIVERY_AREA,
  type DeliveryAreaSummary,
} from "@/shared/utils/delivery/deliveryArea";
import { cartPageViewStyles as styles } from "../../../styles/page/cartPageView.styles";

interface CartDeliveryAreaProps {
  deliveryArea?: DeliveryAreaSummary;
}

/**
 * The delivery area in the cart summary: which area the basket was priced for, how long it
 * takes, and — when a vendor in the basket doesn't serve it — the warning that stops
 * checkout. Split out of `OrderSummaryAside` to keep that component inside its line ceiling.
 */
export function CartDeliveryArea({ deliveryArea }: CartDeliveryAreaProps) {
  const area = deliveryArea ?? UNKNOWN_DELIVERY_AREA;

  return (
    <div className={styles.asideDeliveryArea}>
      <DeliveryPincodeChip />
      <DeliveryServiceabilityNotice
        pincode={area.pincode}
        status={area.status}
        isChecking={area.isChecking}
      />
    </div>
  );
}
