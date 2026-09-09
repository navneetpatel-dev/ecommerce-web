"use client";

import { useParams, useRouter } from "next/navigation";
import { useDelivery } from "../../api/agent/deliveryAgent.queries";
import { formatAddress } from "../../utils/deliveries/formatAddress";
import { NEXT_DELIVERY_STATUS } from "../../utils/deliveries/deliveryStatus";
import { TERMINAL_DELIVERY_STATUSES } from "../../utils/deliveries/activeStatuses";
import { PATHS } from "@/shared/constants/paths/paths";
import { useDeliveryTaskActions } from "./useDeliveryTaskActions.hook";

export function useDeliveryTaskDetailPage() {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const router = useRouter();
  const query = useDelivery(shipmentId);
  const shipment = query.data;
  const actions = useDeliveryTaskActions(shipmentId, shipment?.codAmount);

  const order = shipment?.subOrder?.order;
  const customer = order?.user;
  const addressText = formatAddress(order?.shippingAddress);
  const next = shipment ? NEXT_DELIVERY_STATUS[shipment.status] : undefined;
  const isOutForDelivery = shipment?.status === "OUT_FOR_DELIVERY";
  const isRtoInitiated = shipment?.status === "RTO_INITIATED";
  const isDelivered = shipment?.status === "DELIVERED";
  const isRtoDelivered = shipment?.status === "RTO_DELIVERED";
  const isTerminal = shipment
    ? TERMINAL_DELIVERY_STATUSES.includes(shipment.status)
    : true;
  const hasAttempts = Boolean(shipment?.attempts?.length);
  const orderShortId = order?.id ? order.id.slice(0, 8) : null;

  const onConfirm = async () => {
    if (await actions.complete()) router.push(PATHS.delivery.today);
  };

  const onConfirmRtoHandover = async () => {
    if (await actions.completeRtoHandover()) {
      router.push(PATHS.delivery.deliveries);
    }
  };

  return {
    shipmentId,
    query,
    shipment,
    actions,
    order,
    customer,
    addressText,
    next,
    isOutForDelivery,
    isRtoInitiated,
    isDelivered,
    isRtoDelivered,
    isTerminal,
    hasAttempts,
    orderShortId,
    onConfirm,
    onConfirmRtoHandover,
  };
}
