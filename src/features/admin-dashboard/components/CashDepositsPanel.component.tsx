"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Wallet, XCircle } from "lucide-react";
import {
  deliveryAdminApi,
  type CashDeposit,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
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

  useEffect(() => {
    deliveryAdminApi
      .cashDeposits()
      .then(setDeposits)
      .catch(() => setDeposits([]))
      .finally(() => setLoading(false));
  }, []);

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
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <Wallet className="size-5 text-brand" aria-hidden="true" />
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">
            COD cash deposits reconciliation
          </h2>
        </div>
        {pending.length > 0 ? (
          <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning">
            {pending.length} pending verification
          </span>
        ) : null}
      </div>
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger">
          {error}
        </div>
      ) : null}
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading deposits...</p>
      ) : deposits.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-ink-muted">
          No cash deposits submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2.5 pr-3 font-medium">Agent</th>
                <th className="py-2.5 pr-3 font-medium">Declared</th>
                <th className="py-2.5 pr-3 font-medium">Expected</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium">Note</th>
                <th className="py-2.5 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => {
                const mismatch =
                  Math.abs(deposit.amount - deposit.expectedAmount) > 0.01;
                return (
                  <tr
                    key={deposit.id}
                    className="border-b border-line/60 hover:bg-paper/40 transition-colors"
                  >
                    <td className="py-2.5 pr-3">
                      {deposit.deliveryAgent?.fullName ?? "—"}
                    </td>
                    <td className="py-2.5 pr-3 font-mono font-medium">
                      ₹{deposit.amount.toFixed(2)}
                    </td>
                    <td
                      className={`py-2.5 pr-3 font-mono ${mismatch ? "text-danger font-semibold" : "text-ink-muted"}`}
                    >
                      ₹{deposit.expectedAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-caption font-semibold ${
                          deposit.status === "VERIFIED"
                            ? "bg-success/15 text-success"
                            : deposit.status === "REJECTED"
                              ? "bg-danger/15 text-danger"
                              : "bg-warning/15 text-warning"
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-ink-muted">
                      {deposit.status === "REJECTED"
                        ? deposit.rejectionReason
                        : (deposit.note ?? "—")}
                    </td>
                    <td className="py-2.5 pr-3">
                      {deposit.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-success/40 text-success hover:bg-success hover:text-paper"
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
                            className="h-8 border-danger/40 text-danger hover:bg-danger hover:text-paper"
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
