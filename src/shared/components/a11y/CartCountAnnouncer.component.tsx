"use client";

import { useEffect, useRef } from "react";
import { cartCountAnnouncement } from "@/shared/utils/a11y/cartAnnouncement";
import { routeAnnouncerStyles } from "@/shared/styles/a11y/routeAnnouncer.styles";

/**
 * Announces cart count changes. Adding from a product card is otherwise silent
 * for screen-reader users — the badge is a visual pill and the drawer only
 * opens on request. Writes to the live region node directly: this is a DOM
 * synchronisation, not render state, and it keeps re-renders to zero.
 *
 * Mount once per page (the header owns it): two regions would announce twice.
 */
export function CartCountAnnouncer({ count }: { count: number }) {
  const regionRef = useRef<HTMLParagraphElement>(null);
  const previousCount = useRef(count);

  useEffect(() => {
    if (previousCount.current === count) return;
    previousCount.current = count;
    const region = regionRef.current;
    if (region) region.textContent = cartCountAnnouncement(count);
  }, [count]);

  return (
    <p
      ref={regionRef}
      className={routeAnnouncerStyles.status}
      role="status"
      aria-atomic="true"
    />
  );
}
