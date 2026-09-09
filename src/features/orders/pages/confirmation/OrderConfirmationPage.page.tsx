"use client";

import { useOrderConfirmationPage } from "../../hooks/confirmation/useOrderConfirmationPage.hook";
import { OrderConfirmation } from "../../components/confirmation/OrderConfirmation.component";

export function OrderConfirmationPage() {
  const page = useOrderConfirmationPage();
  return <OrderConfirmation orderId={page.orderId} />;
}
