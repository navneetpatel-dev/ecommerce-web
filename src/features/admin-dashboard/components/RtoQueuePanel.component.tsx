"use client";

import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import {
  deliveryAdminApi,
  type DeliveryShipment,
} from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

/** Admin/hub visibility into every shipment currently mid-RTO or already handed back. */
export function RtoQueuePanel() {
  const [shipments, setShipments] = useState<DeliveryShipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryAdminApi
      .rtoShipments()
      .then(setShipments)
      .catch(() => setShipments([]))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = shipments.filter(
    (s) => s.status === "RTO_INITIATED",
  ).length;

  return (
    <section className="space-y-3 border-b border-line pb-6">
      <div className="flex items-center gap-2">
        <Undo2 className="size-4 text-warning" aria-hidden="true" />
        <TextEyebrow className="!mb-0">
          RTO queue{" "}
          {pendingCount > 0 ? `(${pendingCount} awaiting handover)` : ""}
        </TextEyebrow>
      </div>
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading RTO queue...</p>
      ) : shipments.length === 0 ? (
        <p className="text-body-sm text-ink-muted">
          No shipments are currently returning to origin.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2 pr-3 font-medium">Tracking #</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Agent</th>
                <th className="py-2 pr-3 font-medium">Failed attempts</th>
                <th className="py-2 pr-3 font-medium">Last note</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="border-b border-line/60">
                  <td className="py-2 pr-3 font-mono">
                    {shipment.trackingNumber}
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="py-2 pr-3">
                    {shipment.deliveryAgent?.fullName ?? "—"}
                  </td>
                  <td className="py-2 pr-3">{shipment.failedAttemptCount}</td>
                  <td className="py-2 pr-3 text-ink-muted">
                    {shipment.failureReason ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
