import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { OrderDetailPage } from "@/features/orders";
import { AuthGate } from "@/shared/components/system/AuthGate.component";

export const metadata = generateNoIndexMetadata("Order Details");

/**
 * Gated like `/orders`, `/wallet` and `/my-returns`: the backend requires
 * `authenticate` on `GET /orders/:id`, so an ungated page let a signed-out
 * visitor's cold load fire that request with no bearer — a guaranteed 401 whose
 * refresh also failed, which drove the global `handleSessionExpiry` cache
 * handler into a "session expired" toast plus a login redirect for someone who
 * was never signed in. `AuthGate` renders nothing until `authBootstrapped &&
 * accessToken`, so `useOrder` now always mounts with a real bearer.
 */
export default function OrderDetail() {
  return (
    <AuthGate>
      <OrderDetailPage />
    </AuthGate>
  );
}
