"use client";

import { useEffect } from "react";
import { initErrorReporting } from "@/shared/lib/errorReporting";

/**
 * Initializes crash/error reporting exactly once for the whole app
 * (Rule 20). Mounted from the root providers tree.
 */
export function ErrorReportingProvider() {
  useEffect(() => {
    initErrorReporting();
  }, []);

  return null;
}
