/**
 * Admin Web Vitals report copy. NOT YET merged into the root `LABELS`
 * object (labels.ts is a shared file edited centrally) — see the "SHARED
 * FILE CHANGES NEEDED" note left for this task. Imported directly by the
 * AdminWebVitalsPage feature files in the meantime.
 */
export const webVitalsReportLabels = {
  webVitals: "Web Vitals",
  webVitalsHint:
    "p75 of real-user Core Web Vitals (LCP, INP, CLS, TTFB, FCP), grouped by page path.",
  webVitalsLoad: "Load",
  webVitalsLoading: "Loading Web Vitals…",
  webVitalsEmpty: "No Web Vitals samples in this date range.",
  webVitalsColMetric: "Metric",
  webVitalsColPage: "Page",
  webVitalsColP75: "p75",
  webVitalsColSamples: "Samples",
  webVitalsPathFilterLabel: "Page path",
  webVitalsPathFilterPlaceholder: "e.g. /products/123 (leave blank for all)",
} as const;
