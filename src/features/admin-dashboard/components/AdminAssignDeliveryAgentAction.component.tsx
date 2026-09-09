"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  deliveryAdminApi,
  type DeliveryAgent,
} from "@/features/delivery-dashboard";

export function AdminAssignDeliveryAgentAction({
  returnId,
  onDone,
}: {
  returnId: string;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setOpen(true);
    setLoadingAgents(true);
    deliveryAdminApi
      .list({ page: 1, limit: 100 })
      .then((result) =>
        setAgents(
          result.items.filter(
            (agent) =>
              agent.status === "ACTIVE" && agent.availableForAssignment,
          ),
        ),
      )
      .catch(() => setAgents([]))
      .finally(() => setLoadingAgents(false));
  };

  const close = () => {
    if (pending) return;
    setOpen(false);
    setError(null);
  };

  const submit = async () => {
    if (!selectedAgentId) return;
    setPending(true);
    setError(null);
    try {
      await deliveryAdminApi.assignPickup(returnId, selectedAgentId);
      setOpen(false);
      onDone();
    } catch (submitError) {
      setError(
        getApiErrorMessage(submitError, "Could not assign a delivery agent."),
      );
    } finally {
      setPending(false);
    }
  };

  const agentSelectPlaceholder = loadingAgents
    ? "Loading agents..."
    : "Select an agent";
  const agentOptions = agents.map((agent) => (
    <SelectItem key={agent.id} value={agent.id}>
      {agent.fullName} · {agent.hubOrZone}
    </SelectItem>
  ));
  const showNoAgentsHint = !loadingAgents && agents.length === 0;
  const noAgentsHint = showNoAgentsHint ? (
    <p className="text-body-sm text-ink-muted">
      No active, available agents right now.
    </p>
  ) : null;
  const errorMessage = error ? (
    <p className="text-body-sm text-danger">{error}</p>
  ) : null;

  return (
    <>
      <Button size="sm" variant="outline" onClick={openDialog}>
        <UserCheck className="size-4" aria-hidden="true" />
        Assign agent
      </Button>
      <StatusDialog
        open={open}
        onOpenChange={(next) => (next ? openDialog() : close())}
        variant="success"
        title="Assign a delivery agent"
        description="The agent will see this pickup in their app and can confirm it with the customer's code."
        secondaryAction={{ label: "Cancel", onClick: close, disabled: pending }}
        primaryAction={{
          label: "Assign",
          onClick: () => void submit(),
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
            <SelectContent>{agentOptions}</SelectContent>
          </Select>
        </FormFieldFrame>
        {noAgentsHint}
        {errorMessage}
      </StatusDialog>
    </>
  );
}
