"use client";

import { LocationBeacon } from "../location/LocationBeacon.component";
import { DoorstepConfirmCard } from "../doorstep/DoorstepConfirmCard.component";
import { RtoHandoverCard } from "../rto/RtoHandoverCard.component";
import { DeliveryMilestoneCard } from "./DeliveryMilestoneCard.component";
import { DeliveryTerminalStatusBanner } from "./DeliveryTerminalStatusBanner.component";
import type { useDeliveryTaskActions } from "../../hooks/deliveries/useDeliveryTaskActions.hook";
import type { DeliveryShipment } from "../../types/agent/types";

type DeliveryTaskActions = ReturnType<typeof useDeliveryTaskActions>;
type NextStep = { status: string; label: string };

interface DeliveryTaskPrimaryPanelProps {
  shipment: DeliveryShipment;
  shipmentId: string;
  actions: DeliveryTaskActions;
  next: NextStep | undefined;
  isOutForDelivery: boolean;
  isRtoInitiated: boolean;
  isDelivered: boolean;
  isRtoDelivered: boolean;
  onConfirm: () => void;
  onConfirmRtoHandover: () => void;
}

export function DeliveryTaskPrimaryPanel({
  shipment,
  shipmentId,
  actions,
  next,
  isOutForDelivery,
  isRtoInitiated,
  isDelivered,
  isRtoDelivered,
  onConfirm,
  onConfirmRtoHandover,
}: DeliveryTaskPrimaryPanelProps) {
  if (isOutForDelivery) {
    return (
      <>
        <LocationBeacon active />
        <DoorstepConfirmCard
          otpCode={actions.otpCode}
          onOtpCodeChange={actions.setOtpCode}
          proof={actions.proof}
          onProofChange={actions.setProof}
          onConfirm={onConfirm}
          confirmPending={actions.confirm.isPending || actions.upload.isPending}
          requestCodePending={actions.requestCode.isPending}
          requestCodeSuccess={actions.requestCode.isSuccess}
          expiresInMinutes={actions.requestCode.data?.expiresInMinutes}
          onRequestCode={() => actions.requestCode.mutate(shipmentId)}
          codAmount={shipment.codAmount}
          codCollected={actions.codCollected}
          onCodCollectedChange={actions.setCodCollected}
        />
      </>
    );
  }

  if (isRtoInitiated) {
    return (
      <RtoHandoverCard
        otpCode={actions.rtoOtpCode}
        onOtpCodeChange={actions.setRtoOtpCode}
        onConfirm={onConfirmRtoHandover}
        confirmPending={actions.confirmRto.isPending}
        requestCodePending={actions.requestRtoCode.isPending}
        requestCodeSuccess={actions.requestRtoCode.isSuccess}
        expiresInMinutes={actions.requestRtoCode.data?.expiresInMinutes}
        onRequestCode={() => actions.requestRtoCode.mutate(shipmentId)}
      />
    );
  }

  if (next) {
    return (
      <DeliveryMilestoneCard
        label={next.label}
        loading={actions.update.isPending}
        onAdvance={() => void actions.runStatus(next.status)}
      />
    );
  }

  if (isDelivered) {
    return <DeliveryTerminalStatusBanner variant="DELIVERED" />;
  }

  if (isRtoDelivered) {
    return <DeliveryTerminalStatusBanner variant="RTO_DELIVERED" />;
  }

  return null;
}
