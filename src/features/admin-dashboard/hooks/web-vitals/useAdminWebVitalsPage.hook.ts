"use client";

import { useEffect, useState } from "react";
import {
  webVitalsAdminApi,
  type WebVitalSummaryRow,
} from "../../api/web-vitals/webVitals.api";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const DEFAULT_TO = new Date();
const DEFAULT_FROM = new Date(DEFAULT_TO.getTime() - 7 * 24 * 60 * 60 * 1000);

/** Orchestrates the admin Web Vitals p75 summary: date range + optional page-path filter. */
export function useAdminWebVitalsPage() {
  const [from, setFrom] = useState(isoDate(DEFAULT_FROM));
  const [to, setTo] = useState(isoDate(DEFAULT_TO));
  const [path, setPath] = useState("");
  const [rows, setRows] = useState<WebVitalSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load(rangeFrom: string, rangeTo: string, filterPath: string) {
    setLoading(true);
    setError(null);
    return webVitalsAdminApi
      .summary({
        from: rangeFrom,
        to: rangeTo,
        path: filterPath.trim() || undefined,
      })
      .then(setRows)
      .catch(() => {
        setRows([]);
        setError("Could not load Web Vitals data.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(from, to, path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    from,
    to,
    path,
    setFrom,
    setTo,
    setPath,
    rows,
    loading,
    error,
    reload: () => load(from, to, path),
  };
}
