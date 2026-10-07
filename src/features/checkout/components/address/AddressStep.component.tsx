"use client";

import { ArrowRight, Plus } from "lucide-react";
import type { Address } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { AddressFormDialog } from "@/shared/components/AddressFormDialog.component";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { DeliveryServiceabilityNotice } from "@/shared/components/delivery/DeliveryServiceabilityNotice.component";
import {
  isDeliveryAreaBlocked,
  UNKNOWN_DELIVERY_AREA,
  type DeliveryAreaSummary,
} from "@/shared/utils/delivery/deliveryArea";
import { LABELS } from "@/shared/constants/labels";
import { useAddressStep } from "../../hooks/address/useAddressStep.hook";
import { AddressEmptyState } from "./AddressEmptyState.component";
import { AddressList } from "./AddressList.component";
import { ADDRESS_STEP_STYLES } from "../../styles/address/addressStep.styles";

interface AddressStepProps {
  addresses?: Address[];
  selectedId: string | null;
  isCreating?: boolean;
  /** The delivery area the chosen address implies — warns, and blocks Continue on a "no". */
  deliveryArea?: DeliveryAreaSummary;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onCreateAddress: (body: Omit<Address, "id" | "userId">) => Promise<void>;
}

export function AddressStep({
  addresses,
  selectedId,
  isCreating,
  deliveryArea,
  onSelect,
  onContinue,
  onCreateAddress,
}: AddressStepProps) {
  const {
    showDialog,
    setShowDialog,
    openDialog,
    hasAddresses,
    addressCountText,
    emptyHintMessage,
    handleSelect,
    canContinue,
  } = useAddressStep({
    addresses,
    selectedId,
    onSelect,
  });

  const area = deliveryArea ?? UNKNOWN_DELIVERY_AREA;
  // Hard gate: an address we can't deliver to isn't fixable here, so Continue stays closed
  // and the hint says which decision to revisit. Saving the address itself is still allowed.
  const isAreaBlocked = isDeliveryAreaBlocked(area);
  const canProceed = canContinue && !isAreaBlocked;
  const continueHint = isAreaBlocked
    ? LABELS.deliveryAreaChooseAnotherAddress
    : emptyHintMessage;

  return (
    <div className={ADDRESS_STEP_STYLES.root}>
      {hasAddresses && (
        <div className={ADDRESS_STEP_STYLES.headerRow}>
          <p className={ADDRESS_STEP_STYLES.countText}>{addressCountText}</p>
          <Button
            type="button"
            variant="outline"
            onClick={openDialog}
            className={ADDRESS_STEP_STYLES.addAddressBtn}
          >
            <Plus size={16} />
            {LABELS.addAddress}
          </Button>
        </div>
      )}

      {!hasAddresses && !showDialog && (
        <AddressEmptyState onAddClick={openDialog} />
      )}

      <AddressFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        hasAddresses={hasAddresses}
        isPending={isCreating}
        title={LABELS.newAddress}
        onSubmit={onCreateAddress}
      />

      {hasAddresses && addresses && (
        <AddressList
          addresses={addresses}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      )}

      <DeliveryServiceabilityNotice
        pincode={area.pincode}
        status={area.status}
        isChecking={area.isChecking}
      />

      <DisabledActionHint
        disabled={!canProceed}
        message={continueHint}
        className={ADDRESS_STEP_STYLES.actionHint}
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!canProceed}
          fullWidth="mobile"
          className={ADDRESS_STEP_STYLES.continueButton}
        >
          {LABELS.continueToShipping}
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  );
}
