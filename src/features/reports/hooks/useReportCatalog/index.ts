"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsEngineApi,
  type ReportCatalogItem,
} from "../../api/reportsEngine.api";

/**
 * Loads the report catalog for the audience, exposing a named error plus
 * retry so the page can render a recoverable state (Rule 13).
 */
export function useReportCatalog(options?: { preferAudience?: string }) {
  const [catalog, setCatalog] = useState<ReportCatalogItem[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [reportType, setReportTypeState] = useState<string>("");

  const loadCatalog = useCallback(() => {
    setCatalogError(null);
    return reportsEngineApi
      .catalog()
      .then((items) => {
        const filtered = options?.preferAudience
          ? items.filter((i) => i.audience.startsWith(options.preferAudience!))
          : items;
        setCatalog(filtered.length ? filtered : items);
        if ((filtered.length ? filtered : items)[0]) {
          setReportTypeState((filtered.length ? filtered : items)[0]!.type);
        }
      })
      .catch((error) =>
        setCatalogError(getApiErrorMessage(error, LABELS.reportCatalogError)),
      );
  }, [options?.preferAudience]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const selected = useMemo(
    () => catalog.find((c) => c.type === reportType) ?? null,
    [catalog, reportType],
  );

  return {
    catalog,
    catalogError,
    reportType,
    setReportTypeState,
    selected,
    onRetryCatalog: () => void loadCatalog(),
  };
}
