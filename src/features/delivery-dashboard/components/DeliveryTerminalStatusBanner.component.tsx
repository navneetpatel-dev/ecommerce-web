import { CheckCircle2 } from "lucide-react";

interface DeliveryTerminalStatusBannerProps {
  variant: "DELIVERED" | "RTO_DELIVERED";
}

const COPY = {
  DELIVERED: {
    className: "text-success",
    title: "Delivery Completed",
    body: "Package successfully handed over.",
  },
  RTO_DELIVERED: {
    className: "text-ink",
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
      className={`flex items-center gap-3 border border-line bg-surface p-5 shadow-elevation-1 ${copy.className}`}
    >
      <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-medium">{copy.title}</p>
        <p className="text-body-sm text-ink-muted">{copy.body}</p>
      </div>
    </div>
  );
}
