"use client";

import { useCallback, useState } from "react";
import {
  defaultRange,
  exportFilterDisableHint,
  useReportExport,
} from "@/features/reports";

export function useAdminAuditExportPanel() {
  const [from, setFrom] = useState(defaultRange().from);
  const [to, setTo] = useState(defaultRange().to);

  const buildFilters = useCallback(() => ({ from, to }), [from, to]);

  const exportHub = useReportExport("audit-log", buildFilters);
  const filterHint = exportFilterDisableHint({
    message: exportHub.message,
    exportingFormat: exportHub.exportingFormat,
    controlsDisabled: exportHub.controlsDisabled,
  });

  return {
    from,
    to,
    setFrom,
    setTo,
    filterHint,
    exportHub,
  };
}
