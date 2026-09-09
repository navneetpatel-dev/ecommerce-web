import { useEffect, useState, useMemo } from "react";
import {
  deliveryAdminApi,
  type DeliveryShipment,
} from "@/features/delivery-dashboard";

export function useRtoQueuePanel() {
  const [shipments, setShipments] = useState<DeliveryShipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryAdminApi
      .rtoShipments()
      .then(setShipments)
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = useMemo(
    () => shipments.filter((s) => s.status === "RTO_INITIATED").length,
    [shipments],
  );

  return {
    shipments,
    loading,
    pendingCount,
  };
}
