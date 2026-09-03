import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";

export type PushSubscriptionKeys = {
  p256dh: string;
  auth: string;
};

export type PushSubscriptionBody = {
  endpoint: string;
  keys: PushSubscriptionKeys;
};

export const pushSubscriptionApi = {
  getPublicKey: () =>
    apiClient.get<{ publicKey: string }>(API.notifications.pushPublicKey),
  subscribe: (body: PushSubscriptionBody) =>
    apiClient.post(API.notifications.pushSubscribe, body),
  unsubscribe: (endpoint: string) =>
    apiClient.delete(
      `${API.notifications.pushSubscribe}?endpoint=${encodeURIComponent(endpoint)}`,
    ),
};
