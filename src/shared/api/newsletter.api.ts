import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export type NewsletterSubscribeResult = {
  subscribed: boolean;
  alreadySubscribed: boolean;
  /** True when a confirmation email was sent (double opt-in). */
  confirmationSent?: boolean;
};

export const newsletterApi = {
  subscribe: (email: string) =>
    apiClient.post<NewsletterSubscribeResult>(API.newsletter.subscribe, {
      email,
    }),
  confirm: (token: string) =>
    apiClient.post<{ confirmed: boolean }>(API.newsletter.confirm, { token }),
};
