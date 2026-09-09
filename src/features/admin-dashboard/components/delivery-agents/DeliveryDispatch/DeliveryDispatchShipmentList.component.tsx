"use client";

import { useCallback } from "react";
import { PackageCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { deliveryDispatchShipmentListStyles } from "../../../styles/delivery-agents/deliveryDispatchShipmentList.styles";
import { DeliveryDispatchShipmentGroupsList } from "./DeliveryDispatchShipmentGroupsList.component";
import { useDeliveryDispatchShipmentList } from "../../../hooks/delivery-agents/useDeliveryDispatchShipmentList.hook";

type RunFn = (action: () => Promise<unknown>, success: string) => Promise<void>;

export interface DeliveryDispatchShipmentListProps {
  selectedAgent: string;
  pending: boolean;
  run: RunFn;
}

export function DeliveryDispatchShipmentList({
  selectedAgent,
  pending,
  run,
}: DeliveryDispatchShipmentListProps) {
  const {
    shipments,
    loading,
    selectedIds,
    toggle,
    dispatchSelected,
    allSelected,
    toggleSelectAll,
    groups,
    isAssignDisabled,
  } = useDeliveryDispatchShipmentList({ selectedAgent, run });

  const handleSelectAllChange = useCallback(
    (checked: boolean | "indeterminate") => {
      toggleSelectAll(Boolean(checked));
    },
    [toggleSelectAll],
  );

  const assignLabel = selectedIds.length ? `(${selectedIds.length})` : "";

  return (
    <div className={deliveryDispatchShipmentListStyles.root}>
      <div className={deliveryDispatchShipmentListStyles.header}>
        <div className={deliveryDispatchShipmentListStyles.headerLeft}>
          <p className={deliveryDispatchShipmentListStyles.headerTitle}>
            Unassigned shipments
          </p>
          {selectedIds.length > 0 ? (
            <span className={deliveryDispatchShipmentListStyles.badge}>
              {selectedIds.length} selected
            </span>
          ) : null}
        </div>
        <Button
          size="sm"
          disabled={isAssignDisabled}
          loading={pending}
          onClick={dispatchSelected}
        >
          <PackageCheck
            className={deliveryDispatchShipmentListStyles.assignIcon}
            aria-hidden="true"
          />
          Assign {assignLabel}
        </Button>
      </div>

      <div className={deliveryDispatchShipmentListStyles.scrollArea}>
        {loading ? (
          <p className={deliveryDispatchShipmentListStyles.loadingText}>
            Loading shipments...
          </p>
        ) : shipments.length === 0 ? (
          <p className={deliveryDispatchShipmentListStyles.emptyText}>
            No unassigned shipments waiting.
          </p>
        ) : (
          <>
            <label
              className={deliveryDispatchShipmentListStyles.selectAllLabel}
            >
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAllChange}
              />
              <span>Select all shipments ({shipments.length})</span>
            </label>
            <DeliveryDispatchShipmentGroupsList
              groups={groups}
              selectedIds={selectedIds}
              onToggle={toggle}
            />
          </>
        )}
      </div>
    </div>
  );
}
