"use client";

import { useReportWebVitals } from "next/web-vitals";
import { sendBeacon } from "@/shared/utils/webVitals";
/**
 * Reports Core Web Vitals (LCP, INP, CLS, TTFB, FCP) from real users to the
 * /api/web-vitals endpoint, segmented by route and connection class
 * (performance standard §12). Mounted once in the root layout.
 */
export function WebVitalsReporter() {
  useReportWebVitals(sendBeacon);
  return null;
}
