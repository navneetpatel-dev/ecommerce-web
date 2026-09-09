"use client";

import { useAdminHomeRedirect } from "../../hooks/analytics/useAdminHomeRedirect.hook";

export function AdminHomePage() {
  useAdminHomeRedirect();
  return null;
}
