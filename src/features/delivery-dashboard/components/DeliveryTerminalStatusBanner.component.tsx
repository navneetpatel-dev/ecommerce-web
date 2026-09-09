import { CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { deliveryTerminalStatusBannerStyles } from "./deliveryTerminalStatusBanner.styles";

interface DeliveryTerminalStatusBannerProps {
  variant: "DELIVERED" | "RTO_DELIVERED";
}

const COPY = {
  DELIVERED: {
    className: deliveryTerminalStatusBannerStyles.deliveredVariant,
    title: "Delivery Completed",
    body: "Package successfully handed over.",
  },
  RTO_DELIVERED: {
    className: deliveryTerminalStatusBannerStyles.rtoDeliveredVariant,
    title: "Returned to vendor hub",
    body: "Undelivered parcel handed back after 3 failed attempts.",
  },
} as const;

/** Terminal-state confirmation banner for a completed or RTO-returned delivery task. */
export function DeliveryTerminalStatusBanner({
  variant,
}: DeliveryTerminalStatusBannerProps) {
  const copy = COPY[variant];
  return (
    <div
      className={cn(deliveryTerminalStatusBannerStyles.banner, copy.className)}
    >
      <CheckCircle2
        className={deliveryTerminalStatusBannerStyles.icon}
        aria-hidden="true"
      />
      <div>
        <p className={deliveryTerminalStatusBannerStyles.title}>{copy.title}</p>
        <p className={deliveryTerminalStatusBannerStyles.subtitle}>
          {copy.body}
        </p>
      </div>
    </div>
  );
}
