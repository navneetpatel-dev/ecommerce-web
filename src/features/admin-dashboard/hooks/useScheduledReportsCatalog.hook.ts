"use client";

import { useEffect, useState } from "react";
import {
  reportsEngineApi,
  labelForKey,
  type ReportCatalogItem,
} from "@/features/reports";

export type ScheduledReportTypeOption = { type: string; label: string };

const ADMIN_DIGEST_AUDIENCES = ["admin_finance", "admin_ops", "admin_catalog"];

/** Report types eligible for the platform-wide scheduled admin digest — mirrors the
 * backend's `listSchedulableReportTypes` filter (admin-audience, non vendor-scoped). */
export function useScheduledReportsCatalog() {
  const [options, setOptions] = useState<ScheduledReportTypeOption[]>([]);

  useEffect(() => {
    reportsEngineApi
      .catalog()
      .then((items: ReportCatalogItem[]) => {
        const schedulable = items
          .filter(
            (item) =>
              !item.vendorScoped &&
              ADMIN_DIGEST_AUDIENCES.includes(item.audience),
          )
          .map((item) => ({
            type: item.type,
            label: labelForKey(item.labelKey),
          }));
        setOptions(schedulable);
      })
      .catch(() => setOptions([]));
  }, []);

  return options;
}
