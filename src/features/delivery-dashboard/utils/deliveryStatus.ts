export const NEXT_DELIVERY_STATUS: Record<
  string,
  { status: string; label: string } | undefined
> = {
  PENDING: { status: "PICKED_UP", label: "Mark picked up" },
  PICKED_UP: { status: "IN_TRANSIT", label: "Start transit" },
  IN_TRANSIT: { status: "OUT_FOR_DELIVERY", label: "Start final delivery" },
  FAILED: { status: "IN_TRANSIT", label: "Resume transit" },
};
