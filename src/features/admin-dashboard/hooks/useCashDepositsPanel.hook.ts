"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type CashDeposit,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

/** Owns the admin cash-deposits reconciliation panel's data + verify/reject actions. */
export function useCashDepositsPanel() {
  const [deposits, setDeposits] = useState<CashDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    deliveryAdminApi
      .cashDeposits()
      .then(setDeposits)
      .catch(() => setDeposits([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (depositId: string, action: "VERIFY" | "REJECT") => {
    setError(null);
    setPendingId(depositId);
    try {
      const rejectionReason =
        action === "REJECT"
          ? (window.prompt("Reason for rejecting this deposit?") ?? "")
          : undefined;
      if (action === "REJECT" && !rejectionReason) {
        setPendingId(null);
        return;
      }
      await deliveryAdminApi.verifyCashDeposit(
        depositId,
        action,
        rejectionReason,
      );
      load();
    } catch (actionError) {
      setError(
        getApiErrorMessage(actionError, "Could not update this deposit."),
      );
    } finally {
      setPendingId(null);
    }
  };

  const pending = deposits.filter((d) => d.status === "PENDING");

  return { deposits, loading, pendingId, error, act, pending };
}
