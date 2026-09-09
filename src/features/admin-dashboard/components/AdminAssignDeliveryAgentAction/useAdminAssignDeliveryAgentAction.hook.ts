"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  deliveryAdminApi,
  type DeliveryAgent,
} from "@/features/delivery-dashboard";

interface UseAdminAssignDeliveryAgentActionParams {
  returnId: string;
  onDone: () => void;
}

export function useAdminAssignDeliveryAgentAction({
  returnId,
  onDone,
}: UseAdminAssignDeliveryAgentActionParams) {
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

  const handleOpenChange = (next: boolean) => {
    if (next) {
      openDialog();
    } else {
      close();
    }
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

  const showNoAgentsHint = !loadingAgents && agents.length === 0;

  return {
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
  };
}
