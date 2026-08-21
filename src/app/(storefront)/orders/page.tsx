import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { OrderHistoryPage } from "@/features/orders";

export const metadata = generateNoIndexMetadata("My Orders");

export default function Orders() {
  return <OrderHistoryPage />;
}
