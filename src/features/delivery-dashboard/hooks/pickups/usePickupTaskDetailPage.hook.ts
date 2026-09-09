"use client";

import { useParams, useRouter } from "next/navigation";
import { usePickup } from "../../api/agent/deliveryAgent.queries";
import { formatAddress } from "../../utils/deliveries/formatAddress";
import { PATHS } from "@/shared/constants/paths/paths";
import { usePickupTaskActions } from "./usePickupTaskActions.hook";

export function usePickupTaskDetailPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const router = useRouter();
  const query = usePickup(returnId);
  const pickup = query.data;
  const actions = usePickupTaskActions(returnId);

  const productName = pickup?.orderItem?.productName ?? pickup?.productName;
  const addressText = formatAddress(pickup?.subOrder?.order?.shippingAddress);
  const isExchange = pickup?.type === "EXCHANGE";
  const isScheduled = pickup?.status === "PICKUP_SCHEDULED";
  const hasFailureReason = Boolean(pickup?.pickupFailureReason);
  const returnShortId = pickup?.id.slice(0, 8);

  const onConfirm = async () => {
    if (await actions.complete()) router.push(PATHS.delivery.today);
  };

  return {
    returnId,
    query,
    pickup,
    actions,
    productName,
    addressText,
    isExchange,
    isScheduled,
    hasFailureReason,
    returnShortId,
    onConfirm,
  };
}
