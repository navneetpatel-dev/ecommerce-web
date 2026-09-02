import { OrderDetailSkeleton } from "@/features/orders";

/**
 * Without this, `orders/loading.tsx` (a list of cards) is inherited for the
 * detail route, so navigating here flashes the wrong layout before the order
 * renders.
 */
export default function OrderDetailLoading() {
  return <OrderDetailSkeleton />;
}
