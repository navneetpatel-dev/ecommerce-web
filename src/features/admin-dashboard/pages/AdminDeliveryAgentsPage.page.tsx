"use client";

import { useCallback, useState } from "react";
import { AdminDataPage } from "./AdminDataPage.page";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { CreateDeliveryAgentForm } from "../components/CreateDeliveryAgentForm.component";
import { DeliveryDispatchPanel } from "../components/DeliveryDispatchPanel.component";
import { RtoQueuePanel } from "../components/RtoQueuePanel.component";
import { CashDepositsPanel } from "../components/CashDepositsPanel.component";
import { AgentPayoutsPanel } from "../components/AgentPayoutsPanel.component";
import { AgentDocumentsPanel } from "../components/AgentDocumentsPanel.component";
import { AdminDeliveryPerformancePanel } from "../components/AdminDeliveryPerformancePanel.component";
import {
  deliveryAdminApi,
  type DeliveryAgent,
} from "@/features/delivery-dashboard";
import type { AdminListLoadFn } from "../hooks/useAdminDataList.hook";
import { PERMISSIONS } from "@/shared/constants/permissions";

export function AdminDeliveryAgentsPage() {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [revision, setRevision] = useState(0);

  const loadAgents = useCallback<AdminListLoadFn>(async (params) => {
    const result = await deliveryAdminApi.list({
      page: params.page,
      limit: params.limit,
    });
    setAgents(result.items);
    return result;
  }, []);

  const refresh = () => setRevision((value) => value + 1);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-[1.75rem] text-ink">
          Delivery operations
        </h1>
        <p className="mt-1 text-body text-ink-muted">
          Manage field agents and assign shipment or return work.
        </p>
      </header>
      <CreateDeliveryAgentForm onCreated={refresh} />
      <DeliveryDispatchPanel agents={agents} onDispatched={refresh} />
      <RtoQueuePanel />
      <CashDepositsPanel />
      <AgentPayoutsPanel />
      <AgentDocumentsPanel />
      <AdminDeliveryPerformancePanel />
      <AdminDataPage
        key={revision}
        title="Delivery agents"
        permission={PERMISSIONS.DELIVERY_AGENT_MANAGE}
        load={loadAgents}
        columnKeys={[
          "fullName",
          "hubOrZone",
          "vehicleType",
          "status",
          "availableForAssignment",
          "activeDeliveries",
          "activePickups",
          "averageRating",
        ]}
        actions={(row, reload) => (
          <AdminConfirmAction
            label={
              String(row.status) === "SUSPENDED" ? "Reactivate" : "Suspend"
            }
            title={
              String(row.status) === "SUSPENDED"
                ? "Reactivate this agent?"
                : "Suspend this agent?"
            }
            description="This updates both field availability and sign-in access."
            dialogVariant="warning"
            onConfirm={() =>
              deliveryAdminApi
                .update(String(row.id), {
                  status:
                    String(row.status) === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
                })
                .then(() => {
                  reload();
                  refresh();
                })
            }
          />
        )}
      />
    </div>
  );
}
