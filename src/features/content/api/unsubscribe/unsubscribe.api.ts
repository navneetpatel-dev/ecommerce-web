import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export const unsubscribeApi = {
  /** Turns marketing emails off for the account the signed link names (B-54). */
  unsubscribe: (token: string) =>
    apiClient.post<{ unsubscribed: true }>(API.notifications.unsubscribe, {
      token,
    }),
};
