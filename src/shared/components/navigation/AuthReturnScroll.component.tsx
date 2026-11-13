"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useAuthReturnScroll } from "@/shared/hooks/auth/useAuthReturnScroll.hook";

/**
 * Restores the scroll offset a visitor left a page at when a sign-in prompt
 * sent them away. Renders after `RouteScrollReset`, so it wins over the
 * reset-to-top for that one return navigation.
 */
export function AuthReturnScroll() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useAuthReturnScroll(search ? `${pathname}?${search}` : pathname);
  return null;
}
