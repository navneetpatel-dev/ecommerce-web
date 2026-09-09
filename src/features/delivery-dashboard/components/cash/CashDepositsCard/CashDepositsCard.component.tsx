"use client";

import { Wallet } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { cashDepositsCardStyles } from "../../../styles/cash/cashDepositsCard.styles";
import { useCashDepositsCardPresentation } from "../../../hooks/cash/useCashDepositsCardPresentation.hook";
import { CashDepositsTable } from "./CashDepositsTable.component";

export function CashDepositsCard() {
  const { isLoading, isEmpty, rows, summaryText } =
    useCashDepositsCardPresentation();

  return (
    <section className={cashDepositsCardStyles.container}>
      <div className={cashDepositsCardStyles.header}>
        <div className={cashDepositsCardStyles.headerTop}>
          <Wallet
            className={cashDepositsCardStyles.headerIcon}
            aria-hidden="true"
          />
          <TextEyebrow className={cashDepositsCardStyles.headerEyebrow}>
            CASH DEPOSITS
          </TextEyebrow>
        </div>
        <h2 className={cashDepositsCardStyles.title}>COD deposit history</h2>
        <p className={cashDepositsCardStyles.subtitle}>{summaryText}</p>
      </div>

      <div className={cashDepositsCardStyles.body}>
        {isLoading ? (
          <p className={cashDepositsCardStyles.emptyText}>
            Loading deposits...
          </p>
        ) : isEmpty ? (
          <p className={cashDepositsCardStyles.emptyText}>
            No cash deposits submitted yet.
          </p>
        ) : (
          <CashDepositsTable rows={rows} />
        )}
      </div>
    </section>
  );
}
