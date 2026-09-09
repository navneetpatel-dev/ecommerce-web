"use client";

import { UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { DeliveryAgentOptionsList } from "./AdminAssignDeliveryAgentAction/DeliveryAgentOptionsList.component";
import { useAdminAssignDeliveryAgentAction } from "./AdminAssignDeliveryAgentAction/useAdminAssignDeliveryAgentAction.hook";
import { adminAssignDeliveryAgentActionStyles as styles } from "./AdminAssignDeliveryAgentAction/adminAssignDeliveryAgentAction.styles";

interface AdminAssignDeliveryAgentActionProps {
  returnId: string;
  onDone: () => void;
}

export function AdminAssignDeliveryAgentAction({
  returnId,
  onDone,
}: AdminAssignDeliveryAgentActionProps) {
  const {
    open,
    agents,
    selectedAgentId,
    setSelectedAgentId,
    pending,
    error,
    agentSelectPlaceholder,
    showNoAgentsHint,
    openDialog,
    close,
    handleOpenChange,
    submit,
  } = useAdminAssignDeliveryAgentAction({ returnId, onDone });

  const noAgentsHint = showNoAgentsHint ? (
    <p className={styles.noAgentsHint}>
      No active, available agents right now.
    </p>
  ) : null;

  const errorMessage = error ? (
    <p className={styles.errorMessage}>{error}</p>
  ) : null;

  return (
    <>
      <Button size="sm" variant="outline" onClick={openDialog}>
        <UserCheck className={styles.icon} aria-hidden="true" />
        Assign agent
      </Button>
      <StatusDialog
        open={open}
        onOpenChange={handleOpenChange}
        variant="success"
        title="Assign a delivery agent"
        description="The agent will see this pickup in their app and can confirm it with the customer's code."
        secondaryAction={{ label: "Cancel", onClick: close, disabled: pending }}
        primaryAction={{
          label: "Assign",
          onClick: submit,
          loading: pending,
          disabled: !selectedAgentId,
          disabledHint: "Choose an available agent.",
        }}
      >
        <FormFieldFrame
          label="Delivery agent"
          htmlFor={`assign-agent-${returnId}`}
          required
        >
          <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
            <SelectTrigger id={`assign-agent-${returnId}`}>
              <SelectValue placeholder={agentSelectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <DeliveryAgentOptionsList agents={agents} />
            </SelectContent>
          </Select>
        </FormFieldFrame>
        {noAgentsHint}
        {errorMessage}
      </StatusDialog>
    </>
  );
}
