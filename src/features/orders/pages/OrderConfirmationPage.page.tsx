"use client";

import { useOrderConfirmationPage } from "../hooks/useOrderConfirmationPage.hook";
import { OrderConfirmation } from "../components/OrderConfirmation.component";

export function OrderConfirmationPage() {
  const page = useOrderConfirmationPage();
  return <OrderConfirmation orderId={page.orderId} />;
}
