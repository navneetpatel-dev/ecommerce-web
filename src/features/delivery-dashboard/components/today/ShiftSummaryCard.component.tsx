"use client";

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
import type { ShiftSummary } from "../../types/agent/types";
import { useShiftSummaryCard } from "./ShiftSummaryCard/useShiftSummaryCard.hook";
import { CashDepositDialog } from "./ShiftSummaryCard/CashDepositDialog.component";
import {
  SHIFT_CARD_EYEBROW,
  SHIFT_CARD_HEADER,
  SHIFT_CARD_ROOT,
  SHIFT_HEADER_ICON,
  SHIFT_PENDING_BANNER,
  SHIFT_STAT_CAPTION,
  SHIFT_STAT_ICON_BRAND,
  SHIFT_STAT_ICON_SUCCESS,
  SHIFT_STAT_ICON_WARNING,
  SHIFT_STAT_ITEM,
  SHIFT_STAT_NUMBER,
  SHIFT_STATS_GRID,
} from "./ShiftSummaryCard/shiftSummaryCard.styles";

export function ShiftSummaryCard({ summary }: { summary: ShiftSummary }) {
  const {
    open,
    setOpen,
    amount,
    note,
    error,
    isPending,
    isSubmitDisabled,
    openDialog,
    handleAmountChange,
    handleNoteChange,
    handleSubmit,
  } = useShiftSummaryCard(summary);

  return (
    <section className={SHIFT_CARD_ROOT}>
      <div className={SHIFT_CARD_HEADER}>
        <TextEyebrow className={SHIFT_CARD_EYEBROW}>
          Today&apos;s shift
        </TextEyebrow>
        {summary.codCashInHand > 0 ? (
          <Button size="sm" variant="outline" onClick={openDialog}>
            <Wallet className={SHIFT_HEADER_ICON} aria-hidden="true" />
            Deposit cash
          </Button>
        ) : null}
      </div>
      <div className={SHIFT_STATS_GRID}>
        <div className={SHIFT_STAT_ITEM}>
          <PackageCheck className={SHIFT_STAT_ICON_BRAND} aria-hidden="true" />
          <div>
            <p className={SHIFT_STAT_NUMBER}>{summary.deliveredToday}</p>
            <p className={SHIFT_STAT_CAPTION}>Delivered</p>
          </div>
        </div>
        <div className={SHIFT_STAT_ITEM}>
          <RotateCcw className={SHIFT_STAT_ICON_BRAND} aria-hidden="true" />
          <div>
            <p className={SHIFT_STAT_NUMBER}>{summary.pickupsToday}</p>
            <p className={SHIFT_STAT_CAPTION}>Pickups</p>
          </div>
        </div>
        <div className={SHIFT_STAT_ITEM}>
          <Timer className={SHIFT_STAT_ICON_BRAND} aria-hidden="true" />
          <div>
            <p className={SHIFT_STAT_NUMBER}>{summary.onTimePercent}%</p>
            <p className={SHIFT_STAT_CAPTION}>On-time</p>
          </div>
        </div>
        <div className={SHIFT_STAT_ITEM}>
          <IndianRupee className={SHIFT_STAT_ICON_SUCCESS} aria-hidden="true" />
          <div>
            <p className={SHIFT_STAT_NUMBER}>
              ₹{summary.earningsToday.toFixed(0)}
            </p>
            <p className={SHIFT_STAT_CAPTION}>
              Earnings (₹{summary.perTaskEarning}/task)
            </p>
          </div>
        </div>
        <div className={SHIFT_STAT_ITEM}>
          <IndianRupee className={SHIFT_STAT_ICON_WARNING} aria-hidden="true" />
          <div>
            <p className={SHIFT_STAT_NUMBER}>
              ₹{summary.codCashInHand.toFixed(0)}
            </p>
            <p className={SHIFT_STAT_CAPTION}>COD cash in hand</p>
          </div>
        </div>
      </div>
      {summary.pendingDeposits > 0 ? (
        <div className={SHIFT_PENDING_BANNER}>
          <AlertCircle className={SHIFT_STAT_ICON_WARNING} aria-hidden="true" />
          {summary.pendingDeposits} cash deposit
          {summary.pendingDeposits === 1 ? "" : "s"} awaiting hub verification.
        </div>
      ) : null}

      <CashDepositDialog
        open={open}
        onOpenChange={setOpen}
        expectedCod={summary.codCashInHand}
        amount={amount}
        note={note}
        error={error}
        isPending={isPending}
        isSubmitDisabled={isSubmitDisabled}
        onAmountChange={handleAmountChange}
        onNoteChange={handleNoteChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
