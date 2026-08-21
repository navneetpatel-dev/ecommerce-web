import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { OrderDetailPage } from "@/features/orders";

export const metadata = generateNoIndexMetadata("Order Details");

export default function OrderDetail() {
  return <OrderDetailPage />;
}
