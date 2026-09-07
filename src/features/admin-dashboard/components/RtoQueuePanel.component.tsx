"use client";

import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import {
  deliveryAdminApi,
  type DeliveryShipment,
} from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/StatusBadge.component";

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
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Undo2 className="size-5 text-warning" aria-hidden="true" />
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">
            Return to Origin (RTO) queue
          </h2>
        </div>
        {pendingCount > 0 ? (
          <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning">
            {pendingCount} awaiting handover
          </span>
        ) : null}
      </div>
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading RTO queue...</p>
      ) : shipments.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-ink-muted">
          No shipments are currently returning to origin.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2.5 pr-3 font-medium">Tracking #</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium">Agent</th>
                <th className="py-2.5 pr-3 font-medium">Failed attempts</th>
                <th className="py-2.5 pr-3 font-medium">Last note</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="border-b border-line/60 hover:bg-paper/40 transition-colors"
                >
                  <td className="py-2.5 pr-3 font-mono">
                    {shipment.trackingNumber}
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="py-2.5 pr-3">
                    {shipment.deliveryAgent?.fullName ?? "—"}
                  </td>
                  <td className="py-2.5 pr-3">{shipment.failedAttemptCount}</td>
                  <td className="py-2.5 pr-3 text-ink-muted">
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
