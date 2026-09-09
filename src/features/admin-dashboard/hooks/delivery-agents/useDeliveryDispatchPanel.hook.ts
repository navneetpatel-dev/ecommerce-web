import { useState, useMemo, useCallback } from "react";
import type { DeliveryAgent } from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

interface UseDeliveryDispatchPanelProps {
  agents: DeliveryAgent[];
  onDispatched: () => void;
}

export function useDeliveryDispatchPanel({
  agents,
  onDispatched,
}: UseDeliveryDispatchPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const available = useMemo(
    () =>
      agents.filter(
        (agent) => agent.status === "ACTIVE" && agent.availableForAssignment,
      ),
    [agents],
  );

  const run = useCallback(
    async (action: () => Promise<unknown>, success: string) => {
      setPending(true);
      setError(null);
      setMessage(null);
      try {
        await action();
        setMessage(success);
        onDispatched();
      } catch (actionError) {
        setError(
          getApiErrorMessage(
            actionError,
            "Could not complete this dispatch action.",
          ),
        );
      } finally {
        setPending(false);
      }
    },
    [onDispatched],
  );

  return {
    selectedAgent,
    setSelectedAgent,
    pending,
    message,
    error,
    available,
    run,
  };
}
