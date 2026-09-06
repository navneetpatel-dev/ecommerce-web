import { apiClient } from "@/shared/api/client";
import { API } from "@/shared/constants/apiRoutes";
import type { SavedPaymentMethod } from "../types";

export const savedPaymentMethodsApi = {
  list: () => apiClient.get<SavedPaymentMethod[]>(API.payments.savedMethods),
  remove: (id: string) => apiClient.delete<void>(API.payments.savedMethod(id)),
};
