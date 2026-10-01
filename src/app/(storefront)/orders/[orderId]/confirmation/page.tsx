import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { OrderConfirmationPage } from "@/features/orders";
import { AuthGate } from "@/shared/components/system/AuthGate.component";

export const metadata = generateNoIndexMetadata("Order Confirmation");

/** Same reasoning as `/orders/[orderId]`: `GET /orders/:id` needs a bearer, so
 * the page must not mount its order query before `AuthGate` has one. */
export default function OrderConfirmationRoute() {
  return (
    <AuthGate>
      <OrderConfirmationPage />
    </AuthGate>
  );
}
