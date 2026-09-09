import { memo } from "react";
import {
  ORDER_STATUS_GROUP_STYLES,
  TONE_CLASS,
  DOT_CLASS,
} from "./orderStatusGroup.styles";
import { orderTone, paymentTone } from "../utils/orderStatusDisplay.utils";

interface CompactStatusLineProps {
  kind: "order" | "payment";
  status: string;
  label: string;
}

export const CompactStatusLine = memo(function CompactStatusLine({
  kind,
  status,
  label,
}: CompactStatusLineProps) {
  const tone = kind === "order" ? orderTone(status) : paymentTone(status);
  const field = kind === "order" ? "Order" : "Payment";

  return (
    <div
      className={ORDER_STATUS_GROUP_STYLES.compactLine}
      title={`${field}: ${label}`}
    >
      <span className={ORDER_STATUS_GROUP_STYLES.compactField}>{field}</span>
      <span
        className={ORDER_STATUS_GROUP_STYLES.compactValue(TONE_CLASS[tone])}
      >
        <span
          className={ORDER_STATUS_GROUP_STYLES.compactDot(DOT_CLASS[tone])}
          aria-hidden
        />
        <span className={ORDER_STATUS_GROUP_STYLES.compactText}>{label}</span>
      </span>
    </div>
  );
});
