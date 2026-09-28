import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { CurrentUser } from "@/shared/api/types";

/** Shared fixtures for the auth-bootstrap / session-adapter tests. */
export const adminUser: CurrentUser = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Admin",
  phone: null,
  role: "SUPER_ADMIN",
  vendorId: null,
  emailVerified: true,
};

export const impersonatedUser: CurrentUser = {
  id: "user-1",
  email: "shopper@example.com",
  name: "Shopper",
  phone: null,
  role: "CUSTOMER",
  vendorId: null,
  emailVerified: true,
  impersonatedBy: "admin-1",
};

export function encodeJwt(payload: object): string {
  const json = JSON.stringify(payload);
  const base64 = btoa(json).replace(/\+/g, "-").replace(/\//g, "_");
  return `hdr.${base64}.sig`;
}

export function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
