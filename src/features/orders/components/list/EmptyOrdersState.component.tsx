import { Package } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { EMPTY_ORDERS_STATE_STYLES } from "./emptyOrdersState.styles";

export function EmptyOrdersState() {
  return (
    <div className={EMPTY_ORDERS_STATE_STYLES.root}>
      <div aria-hidden className={EMPTY_ORDERS_STATE_STYLES.radialBackground} />
      <div className={EMPTY_ORDERS_STATE_STYLES.container}>
        <EmptyState
          icon={Package}
          eyebrow="Orders"
          heading="No orders yet"
          message="When you place an order, it will appear here with per-seller tracking and updates."
          actionLabel="Start shopping"
          actionTo={PATHS.products}
        />
      </div>
    </div>
  );
}
