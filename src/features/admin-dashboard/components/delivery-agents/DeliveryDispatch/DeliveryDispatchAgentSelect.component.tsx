import type { DeliveryAgent } from "@/features/delivery-dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { deliveryDispatchPanelStyles } from "./deliveryDispatchPanel.styles";

interface DeliveryDispatchAgentSelectProps {
  available: DeliveryAgent[];
  selectedAgent: string;
  onSelectedAgentChange: (agentId: string) => void;
}

export function DeliveryDispatchAgentSelect({
  available,
  selectedAgent,
  onSelectedAgentChange,
}: DeliveryDispatchAgentSelectProps) {
  const placeholder =
    available.length === 0 ? "No available agents" : "Select available agent";

  return (
    <div className={deliveryDispatchPanelStyles.targetAgentWrapper}>
      <label className={deliveryDispatchPanelStyles.agentLabel}>
        Dispatch target agent *
      </label>
      <Select value={selectedAgent} onValueChange={onSelectedAgentChange}>
        <SelectTrigger className={deliveryDispatchPanelStyles.selectTrigger}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {available.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.fullName} · {agent.hubOrZone} ({agent.vehicleType})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
