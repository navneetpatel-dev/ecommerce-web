"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type DeliveryAgentPerformance,
} from "@/features/delivery-dashboard";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const DEFAULT_TO = new Date();
const DEFAULT_FROM = new Date(DEFAULT_TO.getTime() - 30 * 24 * 60 * 60 * 1000);

/** Owns the date range + fetch state for the admin delivery-performance panel. */
export function useAdminDeliveryPerformancePanel() {
  const [from, setFrom] = useState(isoDate(DEFAULT_FROM));
  const [to, setTo] = useState(isoDate(DEFAULT_TO));
  const [rows, setRows] = useState<DeliveryAgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchReport(rangeFrom: string, rangeTo: string) {
    return deliveryAdminApi
      .performanceReport(rangeFrom, rangeTo)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchReport(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => {
    setLoading(true);
    fetchReport(from, to);
  };

  return { from, setFrom, to, setTo, rows, loading, load };
}
