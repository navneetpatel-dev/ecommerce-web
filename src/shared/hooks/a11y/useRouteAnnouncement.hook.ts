"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
import {
  announcementForPageTitle,
  isClientNavigation,
  shouldMoveFocusToMain,
} from "@/shared/utils/a11y/routeAnnouncement";

interface RouteTargets {
  main: HTMLElement | null;
  heading: string | null;
}

function readRouteTargets(): RouteTargets {
  const main = document.getElementById(MAIN_CONTENT_ID);
  return { main, heading: main?.querySelector("h1")?.textContent ?? null };
}

/**
 * Announces client-side navigations and moves focus into the new page.
 *
 * The App Router neither announces route changes to assistive tech nor moves
 * focus, so without this a screen-reader user gets no confirmation that
 * anything happened and keeps reading from the old scroll position. Returns the
 * message for the caller's live region.
 */
export function useRouteAnnouncement() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const hasMounted = useRef(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (
      !isClientNavigation(
        previousPathname.current,
        pathname,
        window.location.hash,
      )
    ) {
      previousPathname.current = pathname;
      return;
    }
    previousPathname.current = pathname;

    const { main, heading } = readRouteTargets();
    setMessage(announcementForPageTitle(heading ?? document.title));

    if (main && shouldMoveFocusToMain(document.activeElement)) {
      // preventScroll: the router already scrolled the new page into position.
      main.focus({ preventScroll: true });
    }
  }, [pathname]);

  return message;
}
