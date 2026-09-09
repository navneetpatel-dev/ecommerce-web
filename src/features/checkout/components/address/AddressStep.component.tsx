"use client";

import { ArrowRight, Plus } from "lucide-react";
import type { Address } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { AddressFormDialog } from "@/shared/components/AddressFormDialog.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { useAddressStep } from "./useAddressStep.hook";
import { AddressEmptyState } from "./AddressEmptyState.component";
import { AddressList } from "./AddressList.component";
import { ADDRESS_STEP_STYLES } from "./addressStep.styles";

interface AddressStepProps {
  addresses?: Address[];
  selectedId: string | null;
  isCreating?: boolean;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onCreateAddress: (body: Omit<Address, "id" | "userId">) => Promise<void>;
}

export function AddressStep({
  addresses,
  selectedId,
  isCreating,
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

      <DisabledActionHint
        disabled={!canContinue}
        message={emptyHintMessage}
        className={ADDRESS_STEP_STYLES.actionHint}
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
          fullWidth="mobile"
          className={ADDRESS_STEP_STYLES.continueButton}
        >
          Continue to shipping
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  );
}
