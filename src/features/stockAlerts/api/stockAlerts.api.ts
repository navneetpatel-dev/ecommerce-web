import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";

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
  unsubscribe: (id: string, guestEmail?: string) =>
    apiClient.delete(
      guestEmail
        ? `${API.inventory.stockAlert(id)}?guestEmail=${encodeURIComponent(guestEmail)}`
        : API.inventory.stockAlert(id),
    ),
};
