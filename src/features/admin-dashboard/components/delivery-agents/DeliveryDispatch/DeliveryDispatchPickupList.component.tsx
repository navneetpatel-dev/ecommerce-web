"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { deliveryDispatchPickupListStyles } from "../../../styles/delivery-agents/deliveryDispatchPickupList.styles";
import { DeliveryDispatchPickupGroupsList } from "./DeliveryDispatchPickupGroupsList.component";
import { useDeliveryDispatchPickupList } from "../../../hooks/delivery-agents/useDeliveryDispatchPickupList.hook";

type RunFn = (action: () => Promise<unknown>, success: string) => Promise<void>;

export interface DeliveryDispatchPickupListProps {
  selectedAgent: string;
  pending: boolean;
  run: RunFn;
}

export function DeliveryDispatchPickupList({
  selectedAgent,
  pending,
  run,
}: DeliveryDispatchPickupListProps) {
  const {
    pickups,
    loading,
    returnId,
    setReturnId,
    groups,
    handleAssign,
    placeholder,
    isAssignDisabled,
  } = useDeliveryDispatchPickupList({ selectedAgent, run });

  return (
    <div className={deliveryDispatchPickupListStyles.root}>
      <div className={deliveryDispatchPickupListStyles.header}>
        <p className={deliveryDispatchPickupListStyles.headerTitle}>
          Unassigned return pickups
        </p>
        <Button
          size="sm"
          aria-label="Assign return pickup"
          disabled={isAssignDisabled}
          loading={pending}
          onClick={handleAssign}
        >
          <RotateCcw
            className={deliveryDispatchPickupListStyles.assignIcon}
            aria-hidden="true"
          />
          Assign
        </Button>
      </div>
      <div className={deliveryDispatchPickupListStyles.body}>
        <label className={deliveryDispatchPickupListStyles.label}>
          Select unassigned pickup
        </label>
        <Select value={returnId} onValueChange={setReturnId}>
          <SelectTrigger
            className={deliveryDispatchPickupListStyles.selectTrigger}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <DeliveryDispatchPickupGroupsList groups={groups} />
        </Select>
        {pickups.length === 0 && !loading ? (
          <p className={deliveryDispatchPickupListStyles.emptyText}>
            No unassigned pickups waiting.
          </p>
        ) : null}
      </div>
    </div>
  );
}
