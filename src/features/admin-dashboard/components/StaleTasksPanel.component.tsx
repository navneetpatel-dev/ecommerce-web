"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  deliveryAdminApi,
  type StaleTasksReport,
} from "@/features/delivery-dashboard";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { AdminConfirmAction } from "./AdminConfirmAction.component";
import { deliveryForceConfirmLabels } from "@/shared/constants/labels/deliveryForceConfirm";

function hoursSince(dateString: string): number {
  return Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (60 * 60 * 1000),
  );
}

/** Admin visibility into shipments/pickups stuck mid-transit past a reasonable window. */
export function StaleTasksPanel() {
  const [report, setReport] = useState<StaleTasksReport>({
    shipments: [],
    pickups: [],
  });
  const [loading, setLoading] = useState(true);

  function loadReport() {
    return deliveryAdminApi
      .staleTasks()
      .then(setReport)
      .catch(() => setReport({ shipments: [], pickups: [] }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadReport();
  }, []);

  const total = report.shipments.length + report.pickups.length;

  return (
    <section className="space-y-3 border-b border-line pb-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
        <TextEyebrow className="!mb-0">
          Stuck tasks {total > 0 ? `(${total})` : ""}
        </TextEyebrow>
      </div>
      {loading ? (
        <p className="text-body-sm text-ink-muted">
          Checking for stuck tasks...
        </p>
      ) : total === 0 ? (
        <p className="text-body-sm text-ink-muted">
          Nothing is stuck beyond the usual window right now.
        </p>
      ) : (
        <div className="space-y-4">
          {report.shipments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-body-sm">
                <thead>
                  <tr className="border-b border-line text-left text-ink-muted">
                    <th className="py-2 pr-3 font-medium">Tracking #</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Agent</th>
                    <th className="py-2 pr-3 font-medium">Stuck for</th>
                    <th className="py-2 pr-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {report.shipments.map((shipment) => (
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
                      <td className="py-2 pr-3 text-warning">
                        {hoursSince(shipment.updatedAt)}h
                      </td>
                      <td className="py-2 pr-3">
                        {shipment.status === "OUT_FOR_DELIVERY" ? (
                          <AdminConfirmAction
                            label={
                              deliveryForceConfirmLabels.forceConfirmDelivery
                            }
                            title={
                              deliveryForceConfirmLabels.forceConfirmDeliveryTitle
                            }
                            description={
                              deliveryForceConfirmLabels.forceConfirmDeliveryBody
                            }
                            dialogVariant="warning"
                            tone="archive"
                            requireReason
                            reasonLabel={
                              deliveryForceConfirmLabels.forceConfirmDeliveryReasonLabel
                            }
                            reasonHint={
                              deliveryForceConfirmLabels.forceConfirmDeliveryReasonHint
                            }
                            onConfirm={(reason) =>
                              deliveryAdminApi
                                .forceConfirmDelivery(shipment.id, reason ?? "")
                                .then(() => loadReport())
                            }
                          />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {report.pickups.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-body-sm">
                <thead>
                  <tr className="border-b border-line text-left text-ink-muted">
                    <th className="py-2 pr-3 font-medium">Return ID</th>
                    <th className="py-2 pr-3 font-medium">Agent</th>
                    <th className="py-2 pr-3 font-medium">Failure reason</th>
                    <th className="py-2 pr-3 font-medium">Stuck for</th>
                  </tr>
                </thead>
                <tbody>
                  {report.pickups.map((pickup) => (
                    <tr key={pickup.id} className="border-b border-line/60">
                      <td className="py-2 pr-3 font-mono">
                        {pickup.id.slice(0, 8)}
                      </td>
                      <td className="py-2 pr-3">
                        {pickup.deliveryAgent?.fullName ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-ink-muted">
                        {pickup.pickupFailureReason ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-warning">
                        {hoursSince(pickup.updatedAt)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
