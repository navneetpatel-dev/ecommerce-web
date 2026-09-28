"use client";

import { useRouteAnnouncement } from "@/shared/hooks/a11y/useRouteAnnouncement.hook";
import { routeAnnouncerStyles } from "@/shared/styles/a11y/routeAnnouncer.styles";

/**
 * `role="status"` is polite by default: assistive tech finishes the current
 * sentence before reading the new page's heading.
 */
export function RouteAnnouncer() {
  const message = useRouteAnnouncement();

  return (
    <p className={routeAnnouncerStyles.status} role="status" aria-atomic="true">
      {message}
    </p>
  );
}
