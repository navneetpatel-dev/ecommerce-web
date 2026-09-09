import { apiClient } from "@/shared/api/client";
import { downloadReportFile } from "@/features/reports";
import { API } from "@/shared/constants/apiRoutes";
import type {
  AgentEarning,
  AgentPayout,
  AgentPayoutPaymentMethod,
  BankDetails,
  CashDeposit,
} from "../types";

/** Agent-facing payout/earnings/cash-deposit operations — composed into `deliveryAgentApi`. */
export const deliveryAgentPayoutsApi = {
  closeCashShift: (amount: number, note?: string) =>
    apiClient.post<CashDeposit>(API.deliveryAgents.meCashShiftClose, {
      amount,
      note,
    }),
  myCashDeposits: () =>
    apiClient.get<CashDeposit[]>(API.deliveryAgents.meCashDeposits),
  myPayouts: () => apiClient.get<AgentPayout[]>(API.deliveryAgents.mePayouts),
  downloadPayoutStatement: (payoutId: string) =>
    downloadReportFile(
      API.deliveryAgents.mePayoutStatement(payoutId),
      `payout-statement-${payoutId.slice(0, 8)}.pdf`,
    ),
  myEarningsLedger: () =>
    apiClient.get<AgentEarning[]>(API.deliveryAgents.meEarnings),
  updateBankDetails: (bankDetails: BankDetails) =>
    apiClient.patch<BankDetails>(API.deliveryAgents.meBankDetails, bankDetails),
};

/** Admin-facing payout/earnings/cash-deposit operations — composed into `deliveryAdminApi`. */
export const deliveryAdminPayoutsApi = {
  cashDeposits: () =>
    apiClient.get<CashDeposit[]>(API.deliveryAgents.cashDeposits),
  verifyCashDeposit: (
    depositId: string,
    action: "VERIFY" | "REJECT",
    rejectionReason?: string,
  ) =>
    apiClient.patch<CashDeposit>(
      API.deliveryAgents.verifyCashDeposit(depositId),
      {
        action,
        rejectionReason,
      },
    ),
  payouts: () =>
    apiClient.get<AgentPayout[]>(`${API.deliveryAgents.payouts}?limit=100`),
  processPayouts: () =>
    apiClient.post<AgentPayout[]>(API.deliveryAgents.processPayouts, {}),
  markPayoutPaid: (
    payoutId: string,
    body: {
      paymentMethod: AgentPayoutPaymentMethod;
      paymentReferenceNumber: string;
      paidAt?: string;
      proofOfPaymentUrl?: string;
      remarks?: string;
    },
  ) =>
    apiClient.patch<AgentPayout>(
      API.deliveryAgents.markPayoutPaid(payoutId),
      body,
    ),
  markPayoutFailed: (payoutId: string, reason: string) =>
    apiClient.patch<AgentPayout>(
      API.deliveryAgents.markPayoutFailed(payoutId),
      { reason },
    ),
  retryPayout: (payoutId: string) =>
    apiClient.patch<AgentPayout>(API.deliveryAgents.retryPayout(payoutId), {}),
  downloadPayoutStatement: (payoutId: string) =>
    downloadReportFile(
      API.deliveryAgents.payoutStatement(payoutId),
      `payout-statement-${payoutId.slice(0, 8)}.pdf`,
    ),
};
