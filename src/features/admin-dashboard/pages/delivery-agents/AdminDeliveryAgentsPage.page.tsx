"use client";

import { Plus } from "lucide-react";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminSectionTabs } from "../../components/shared/AdminSectionTabs.component";
import { CreateDeliveryAgentForm } from "../../components/delivery-agents/CreateDeliveryAgentForm.component";
import { DeliveryDispatchPanel } from "../../components/delivery-agents/DeliveryDispatchPanel.component";
import { RtoQueuePanel } from "../../components/shipping/RtoQueuePanel.component";
import { CashDepositsPanel } from "../../components/delivery-agents/CashDepositsPanel.component";
import { AgentPayoutsPanel } from "../../components/delivery-agents/AgentPayoutsPanel.component";
import { AgentDocumentsPanel } from "../../components/delivery-agents/AgentDocumentsPanel.component";
import { AdminDeliveryPerformancePanel } from "../../components/delivery-agents/AdminDeliveryPerformancePanel.component";
import { StaleTasksPanel } from "../../components/delivery-agents/StaleTasksPanel.component";
import { BulkImportAgentsDialog } from "../../components/delivery-agents/BulkImportAgentsDialog/index";
import { Button } from "@/shared/components/ui/button";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { adminPagesStyles } from "../shared/adminPages.styles";
import {
  nextAgentStatus,
  useAdminDeliveryAgentsPage,
} from "../../hooks/delivery-agents/useAdminDeliveryAgentsPage.hook";

export function AdminDeliveryAgentsPage() {
  const page = useAdminDeliveryAgentsPage();

  const renderAgentRowActions = (row: AdminDataRow, reload: () => void) => {
    const { actionLabel, actionTitle } = nextAgentStatus(String(row.status));
    return (
      <AdminConfirmAction
        inline
        label={actionLabel}
        title={actionTitle}
        description="This updates both field availability and sign-in access."
        dialogVariant="warning"
        onConfirm={() => page.handleAgentStatusConfirm(row, reload)}
      />
    );
  };

  const createFormElement = page.showCreateForm ? (
    <CreateDeliveryAgentForm
      onCreated={page.handleCreated}
      onCancel={page.closeCreateForm}
    />
  ) : null;

  const agentsTabContent = (
    <div className={adminPagesStyles.stack6}>
      <div className={adminPagesStyles.headerRow}>
        <p className={adminPagesStyles.hint}>
          View and manage all registered delivery agents, field availability,
          and vehicle assignments.
        </p>
        <div className={adminPagesStyles.flexGap2_5}>
          <Button
            size="sm"
            variant={page.createAgentButtonVariant}
            onClick={page.toggleCreateForm}
            className={adminPagesStyles.buttonGap1_5}
          >
            <Plus className={adminPagesStyles.iconSm} aria-hidden="true" />
            {page.createAgentButtonLabel}
          </Button>
          <span className={adminPagesStyles.captionMediumMuted}>or</span>
          <BulkImportAgentsDialog onImported={page.refresh} />
        </div>
      </div>

      {createFormElement}

      <AdminDataPage
        key={page.revision}
        title="Delivery agents"
        permission={PERMISSIONS.DELIVERY_AGENT_MANAGE}
        load={page.loadAgents}
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
        actions={renderAgentRowActions}
      />
    </div>
  );

  const tabs = [
    { value: "agents", label: "Delivery agents", content: agentsTabContent },
    {
      value: "dispatch",
      label: "Live dispatch",
      content: (
        <DeliveryDispatchPanel
          agents={page.agents}
          onDispatched={page.refresh}
        />
      ),
    },
    {
      value: "exceptions",
      label: "Exceptions & RTO",
      content: (
        <div className={adminPagesStyles.stack6}>
          <StaleTasksPanel />
          <RtoQueuePanel />
        </div>
      ),
    },
    {
      value: "verification",
      label: "Verification & Cash",
      content: (
        <div className={adminPagesStyles.stack6}>
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
  ];

  return (
    <AdminSectionTabs
      title="Delivery operations"
      description="Manage field delivery personnel, live dispatches, RTO queues, cash reconciliation, and performance."
      defaultValue="agents"
      tabs={tabs}
    />
  );
}
