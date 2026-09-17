"use client";

import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { useTicketRelatedShipments } from "../../../hooks/detail/useTicketRelatedShipments.hook";
import type { RoleMode } from "../../../utils/detail/ticketThreadShared";
import { ticketShipmentSummaryStyles as styles } from "../../../styles/detail/ticketShipmentSummary.styles";
import { TicketShipmentList } from "./TicketShipmentList.component";

interface TicketShipmentSummaryProps {
  relatedOrderId: string | null;
  mode: RoleMode;
}

export function TicketShipmentSummary({
  relatedOrderId,
  mode,
}: TicketShipmentSummaryProps) {
  const { shipments, isLoading, isEmpty } = useTicketRelatedShipments(
    relatedOrderId,
    mode,
  );

  if (!relatedOrderId) {
    return null;
  }

  return (
    <div className={styles.section}>
      <TextEyebrow>{LABELS.ticketShipmentSection}</TextEyebrow>
      <TicketShipmentList
        shipments={shipments}
        isLoading={isLoading}
        isEmpty={isEmpty}
      />
    </div>
  );
}
