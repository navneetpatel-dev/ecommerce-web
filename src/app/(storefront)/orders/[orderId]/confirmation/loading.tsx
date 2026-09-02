import { OrderConfirmationSkeleton } from "@/features/orders";

/**
 * Matches the confirmation layout so arriving from checkout does not flash the
 * inherited orders-list skeleton.
 */
export default function OrderConfirmationLoading() {
  return <OrderConfirmationSkeleton />;
}
