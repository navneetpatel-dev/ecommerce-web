"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMyPickups } from "../../api/agent/deliveryAgent.queries";
import { SCHEDULED_PICKUP_STATUSES } from "../../utils/deliveries/activeStatuses";
import { PATHS } from "@/shared/constants/paths/paths";

export function usePickupsPage() {
  const router = useRouter();
  const [scanError, setScanError] = useState<string | null>(null);
  const query = useMyPickups([...SCHEDULED_PICKUP_STATUSES]);
  const count = query.data?.length ?? 0;
  const pickupCountLabel = `${count} scheduled pickup${count === 1 ? "" : "s"}`;

  const handleScanned = (text: string) => {
    const match = query.data?.find(
      (pickup) => pickup.id.toUpperCase() === text.toUpperCase(),
    );
    if (!match) {
      setScanError(`No scheduled pickup matches "${text}".`);
      return;
    }
    setScanError(null);
    router.push(PATHS.delivery.pickup(match.id));
  };

  return {
    query,
    count,
    pickupCountLabel,
    scanError,
    handleScanned,
  };
}
