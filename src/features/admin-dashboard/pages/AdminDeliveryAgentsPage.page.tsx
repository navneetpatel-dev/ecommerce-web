"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { AdminDataPage } from "./AdminDataPage.page";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { AdminSectionTabs } from "../components/AdminSectionTabs.component";
import { CreateDeliveryAgentForm } from "../components/CreateDeliveryAgentForm.component";
import { DeliveryDispatchPanel } from "../components/DeliveryDispatchPanel.component";
import { RtoQueuePanel } from "../components/RtoQueuePanel.component";
import { CashDepositsPanel } from "../components/CashDepositsPanel.component";
import { AgentPayoutsPanel } from "../components/AgentPayoutsPanel.component";
import { AgentDocumentsPanel } from "../components/AgentDocumentsPanel.component";
import { AdminDeliveryPerformancePanel } from "../components/AdminDeliveryPerformancePanel.component";
import { StaleTasksPanel } from "../components/StaleTasksPanel.component";
import { BulkImportAgentsDialog } from "../components/BulkImportAgentsDialog";
import { Button } from "@/shared/components/ui/button";
import {
  deliveryAdminApi,
  type DeliveryAgent,
} from "@/features/delivery-dashboard";
import type { AdminListLoadFn } from "../hooks/useAdminDataList.hook";
import { PERMISSIONS } from "@/shared/constants/permissions";

export function AdminDeliveryAgentsPage() {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [revision, setRevision] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    <AdminSectionTabs
      title="Delivery operations"
      description="Manage field delivery personnel, live dispatches, RTO queues, cash reconciliation, and performance."
      defaultValue="agents"
      tabs={[
        {
          value: "agents",
          label: "Delivery agents",
          content: (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-body-sm text-ink-muted">
                  View and manage all registered delivery agents, field
                  availability, and vehicle assignments.
                </p>
                <div className="flex items-center gap-2.5">
                  <Button
                    size="sm"
                    variant={showCreateForm ? "outline" : "default"}
                    onClick={() => setShowCreateForm((prev) => !prev)}
                    className="gap-1.5"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    {showCreateForm ? "Close form" : "Create agent"}
                  </Button>
                  <span className="text-caption font-medium text-ink-muted">
                    or
                  </span>
                  <BulkImportAgentsDialog onImported={refresh} />
                </div>
              </div>

              {showCreateForm ? (
                <CreateDeliveryAgentForm
                  onCreated={() => {
                    setShowCreateForm(false);
                    refresh();
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              ) : null}

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
                hideTitle
                actions={(row, reload) => (
                  <AdminConfirmAction
                    inline
                    label={
                      String(row.status) === "SUSPENDED"
                        ? "Reactivate"
                        : "Suspend"
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
                            String(row.status) === "SUSPENDED"
                              ? "ACTIVE"
                              : "SUSPENDED",
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
          ),
        },
        {
          value: "dispatch",
          label: "Live dispatch",
          content: (
            <DeliveryDispatchPanel agents={agents} onDispatched={refresh} />
          ),
        },
        {
          value: "exceptions",
          label: "Exceptions & RTO",
          content: (
            <div className="space-y-6">
              <StaleTasksPanel />
              <RtoQueuePanel />
            </div>
          ),
        },
        {
          value: "verification",
          label: "Verification & Cash",
          content: (
            <div className="space-y-6">
              <AgentDocumentsPanel />
              <CashDepositsPanel />
            </div>
          ),
        },
        {
          value: "payouts",
          label: "Agent payouts",
          content: <AgentPayoutsPanel />,
        },
        {
          value: "performance",
          label: "Performance",
          content: <AdminDeliveryPerformancePanel />,
        },
      ]}
    />
  );
}
