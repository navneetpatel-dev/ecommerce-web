"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Wallet, XCircle } from "lucide-react";
import {
  deliveryAdminApi,
  type CashDeposit,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

/** Hub manager reconciliation queue for agent COD cash-deposit submissions. */
export function CashDepositsPanel() {
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

  return (
    <section className="space-y-3 border-b border-line pb-6">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-brand" aria-hidden="true" />
        <TextEyebrow className="!mb-0">
          Cash deposits{" "}
          {pending.length > 0 ? `(${pending.length} pending)` : ""}
        </TextEyebrow>
      </div>
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading deposits...</p>
      ) : deposits.length === 0 ? (
        <p className="text-body-sm text-ink-muted">
          No cash deposits submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2 pr-3 font-medium">Agent</th>
                <th className="py-2 pr-3 font-medium">Declared</th>
                <th className="py-2 pr-3 font-medium">Expected</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Note</th>
                <th className="py-2 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => {
                const mismatch =
                  Math.abs(deposit.amount - deposit.expectedAmount) > 0.01;
                return (
                  <tr key={deposit.id} className="border-b border-line/60">
                    <td className="py-2 pr-3">
                      {deposit.deliveryAgent?.fullName ?? "—"}
                    </td>
                    <td className="py-2 pr-3 font-mono">
                      ₹{deposit.amount.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 pr-3 font-mono ${mismatch ? "text-danger" : "text-ink-muted"}`}
                    >
                      ₹{deposit.expectedAmount.toFixed(2)}
                    </td>
                    <td className="py-2 pr-3">{deposit.status}</td>
                    <td className="py-2 pr-3 text-ink-muted">
                      {deposit.status === "REJECTED"
                        ? deposit.rejectionReason
                        : (deposit.note ?? "—")}
                    </td>
                    <td className="py-2 pr-3">
                      {deposit.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            loading={pendingId === deposit.id}
                            onClick={() => void act(deposit.id, "VERIFY")}
                          >
                            <CheckCircle2
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            loading={pendingId === deposit.id}
                            onClick={() => void act(deposit.id, "REJECT")}
                          >
                            <XCircle className="size-3.5" aria-hidden="true" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
