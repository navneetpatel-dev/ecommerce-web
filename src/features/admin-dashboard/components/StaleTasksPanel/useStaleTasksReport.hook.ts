import { useEffect, useState, useCallback } from "react";
import {
  deliveryAdminApi,
  type StaleTasksReport,
} from "@/features/delivery-dashboard";

export function useStaleTasksReport() {
  const [report, setReport] = useState<StaleTasksReport>({
    shipments: [],
    pickups: [],
  });
  const [loading, setLoading] = useState(true);

  const loadReport = useCallback(() => {
    return deliveryAdminApi
      .staleTasks()
      .then(setReport)
      .catch(() => setReport({ shipments: [], pickups: [] }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const total = report.shipments.length + report.pickups.length;

  const forceConfirmDelivery = useCallback(
    async (shipmentId: string, reason: string) => {
      await deliveryAdminApi.forceConfirmDelivery(shipmentId, reason);
      await loadReport();
    },
    [loadReport],
  );

  return {
    report,
    loading,
    total,
    forceConfirmDelivery,
  };
}
