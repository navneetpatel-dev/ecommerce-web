import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";

export function signIn(role: CurrentUser["role"], permissions: string[]) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions,
      vendorId: null,
      emailVerified: true,
    },
  });
}

export function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export const adminPage = {
  items: [
    {
      id: "v1",
      businessName: "Acme Traders",
      slug: "acme",
      state: "Gujarat",
    },
  ],
  page: 1,
  totalPages: 2,
  total: 30,
};
export const directoryPage = {
  items: [{ id: "v2", businessName: "Bright Goods" }],
  page: 1,
  totalPages: 1,
  total: 1,
};
