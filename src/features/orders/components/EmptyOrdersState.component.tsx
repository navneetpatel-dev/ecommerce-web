import { Package } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { PATHS } from "@/shared/constants/paths";

export function EmptyOrdersState() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />
      <div className="storefront-container relative py-16 md:py-20">
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
