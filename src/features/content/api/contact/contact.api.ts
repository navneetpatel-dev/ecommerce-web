import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type { ContactTopic } from "../../constants/contact/contactTopics";

export type ContactMessageBody = {
  name: string;
  email: string;
  topic: ContactTopic;
  subject: string;
  message: string;
  /** Honeypot: stays empty for real visitors. */
  website?: string;
};

export const contactApi = {
  send: (body: ContactMessageBody) =>
    apiClient.post<{ reference: string }>(API.contact.send, body),
};
