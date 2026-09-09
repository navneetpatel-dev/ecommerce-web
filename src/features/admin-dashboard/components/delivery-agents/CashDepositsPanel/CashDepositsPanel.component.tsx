"use client";

import { Wallet } from "lucide-react";
import { useCashDepositsPanel } from "../../../hooks/delivery-agents/useCashDepositsPanel.hook";
import { cashDepositsPanelStyles } from "./cashDepositsPanel.styles";
import { CashDepositTableBody } from "./CashDepositTableBody.component";

/** Hub manager reconciliation queue for agent COD cash-deposit submissions. */
export function CashDepositsPanel() {
  const { deposits, loading, pendingId, error, act, pending } =
    useCashDepositsPanel();

  return (
    <section className={cashDepositsPanelStyles.root}>
      <div className={cashDepositsPanelStyles.header}>
        <div className={cashDepositsPanelStyles.headerLeft}>
          <Wallet
            className={cashDepositsPanelStyles.headerIcon}
            aria-hidden="true"
          />
          <h2 className={cashDepositsPanelStyles.title}>
            COD cash deposits reconciliation
          </h2>
        </div>
        {pending.length > 0 ? (
          <span className={cashDepositsPanelStyles.pendingBadge}>
            {pending.length} pending verification
          </span>
        ) : null}
      </div>
      {error ? (
        <div className={cashDepositsPanelStyles.errorAlert}>{error}</div>
      ) : null}
      {loading ? (
        <p className={cashDepositsPanelStyles.loadingText}>
          Loading deposits...
        </p>
      ) : deposits.length === 0 ? (
        <p className={cashDepositsPanelStyles.emptyText}>
          No cash deposits submitted yet.
        </p>
      ) : (
        <div className={cashDepositsPanelStyles.tableWrapper}>
          <table className={cashDepositsPanelStyles.table}>
            <thead>
              <tr className={cashDepositsPanelStyles.tableHeaderRow}>
                <th className={cashDepositsPanelStyles.tableHeaderCell}>
                  Agent
                </th>
                <th className={cashDepositsPanelStyles.tableHeaderCell}>
                  Declared
                </th>
                <th className={cashDepositsPanelStyles.tableHeaderCell}>
                  Expected
                </th>
                <th className={cashDepositsPanelStyles.tableHeaderCell}>
                  Status
                </th>
                <th className={cashDepositsPanelStyles.tableHeaderCell}>
                  Note
                </th>
                <th className={cashDepositsPanelStyles.tableHeaderCell}>
                  Actions
                </th>
              </tr>
            </thead>
            <CashDepositTableBody
              deposits={deposits}
              pendingId={pendingId}
              onAct={act}
            />
          </table>
        </div>
      )}
    </section>
  );
}
