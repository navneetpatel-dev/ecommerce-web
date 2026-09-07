import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { OrderHistoryPage } from "@/features/orders";
import { AuthGate } from "@/shared/components/AuthGate.component";

export const metadata = generateNoIndexMetadata("My Orders");

export default function Orders() {
  return (
    <AuthGate>
      <OrderHistoryPage />
    </AuthGate>
  );
}
