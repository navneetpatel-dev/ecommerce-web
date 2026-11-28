import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

/** A signed-in shopper gets the record; a guest only `{ subscribed: true }`. */
export interface StockAlert {
  id: string;
  userId: string | null;
  guestEmail: string | null;
  variantId: string;
  notifiedAt: string | null;
}

export const stockAlertsApi = {
  subscribe: (variantId: string, guestEmail?: string) =>
    apiClient.post<StockAlert>(API.inventory.stockAlerts, {
      variantId,
      guestEmail,
    }),
  unsubscribe: (id: string) => apiClient.delete(API.inventory.stockAlert(id)),
  /** The cancel link in an alert email: the signed token names the alert. */
  cancelByToken: (token: string) =>
    apiClient.post<{ unsubscribed: true }>(
      API.inventory.stockAlertUnsubscribe,
      { token },
    ),
};
