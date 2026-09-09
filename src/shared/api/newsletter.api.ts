import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export type NewsletterSubscribeResult = {
  subscribed: boolean;
  alreadySubscribed: boolean;
};

export const newsletterApi = {
  subscribe: (email: string) =>
    apiClient.post<NewsletterSubscribeResult>(API.newsletter.subscribe, {
      email,
    }),
};
