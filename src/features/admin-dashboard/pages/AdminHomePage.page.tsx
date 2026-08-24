"use client";

import { useAdminHomeRedirect } from "../hooks/useAdminHomeRedirect.hook";

export function AdminHomePage() {
  useAdminHomeRedirect();
  return null;
}
