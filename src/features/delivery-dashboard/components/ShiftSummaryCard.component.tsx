"use client";

import { useState } from "react";
import {
  AlertCircle,
  IndianRupee,
  PackageCheck,
  RotateCcw,
  Timer,
  Wallet,
} from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { useCloseCashShift } from "../api/deliveryAgent.queries";
import type { ShiftSummary } from "../types";

export function ShiftSummaryCard({ summary }: { summary: ShiftSummary }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(() => String(summary.codCashInHand));
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const closeShift = useCloseCashShift();

  const openDialog = () => {
    setAmount(String(summary.codCashInHand));
    setNote("");
    setError(null);
    setOpen(true);
  };

  const submit = async () => {
    setError(null);
    try {
      await closeShift.mutateAsync({
        amount: Number(amount),
        note: note || undefined,
      });
      setOpen(false);
    } catch (submitError) {
      setError(
        getApiErrorMessage(submitError, "Could not submit cash deposit."),
      );
    }
  };

  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5">
        <TextEyebrow className="!mb-0">Today&apos;s shift</TextEyebrow>
        {summary.codCashInHand > 0 ? (
          <Button size="sm" variant="outline" onClick={openDialog}>
            <Wallet className="size-4" aria-hidden="true" />
            Deposit cash
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
        <div className="flex items-center gap-2">
          <PackageCheck className="size-4 text-brand" aria-hidden="true" />
          <div>
            <p className="font-display text-[1.25rem] text-ink">
              {summary.deliveredToday}
            </p>
            <p className="text-caption text-ink-muted">Delivered</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-brand" aria-hidden="true" />
          <div>
            <p className="font-display text-[1.25rem] text-ink">
              {summary.pickupsToday}
            </p>
            <p className="text-caption text-ink-muted">Pickups</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="size-4 text-brand" aria-hidden="true" />
          <div>
            <p className="font-display text-[1.25rem] text-ink">
              {summary.onTimePercent}%
            </p>
            <p className="text-caption text-ink-muted">On-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="size-4 text-success" aria-hidden="true" />
          <div>
            <p className="font-display text-[1.25rem] text-ink">
              ₹{summary.earningsToday.toFixed(0)}
            </p>
            <p className="text-caption text-ink-muted">
              Earnings (₹{summary.perTaskEarning}/task)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="size-4 text-warning" aria-hidden="true" />
          <div>
            <p className="font-display text-[1.25rem] text-ink">
              ₹{summary.codCashInHand.toFixed(0)}
            </p>
            <p className="text-caption text-ink-muted">COD cash in hand</p>
          </div>
        </div>
      </div>
      {summary.pendingDeposits > 0 ? (
        <div className="flex items-center gap-2 border-t border-line bg-warning/10 px-5 py-2.5 text-body-sm text-ink">
          <AlertCircle className="size-4 text-warning" aria-hidden="true" />
          {summary.pendingDeposits} cash deposit
          {summary.pendingDeposits === 1 ? "" : "s"} awaiting hub verification.
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Deposit COD cash</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-body-sm text-ink-muted">
              Declare the cash you&apos;re handing to the hub. The system
              expects ₹{summary.codCashInHand.toFixed(2)} based on collected COD
              orders.
            </p>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount deposited"
            />
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
            />
            {error ? <p className="text-body-sm text-danger">{error}</p> : null}
            <Button
              className="w-full"
              disabled={!amount || Number(amount) < 0}
              loading={closeShift.isPending}
              onClick={() => void submit()}
            >
              Submit deposit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
