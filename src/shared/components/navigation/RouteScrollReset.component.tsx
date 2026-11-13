"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouteScrollMemory } from "@/shared/hooks/navigation/useRouteScrollMemory.hook";

/**
 * New pages open at the top; Back/Forward returns to the remembered position;
 * in-page URL state (tabs, filters) can keep the scroll. See `useRouteScrollMemory`.
 */
export function RouteScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  useRouteScrollMemory(query ? `${pathname}?${query}` : pathname);
  return null;
}
