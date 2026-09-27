export type AgentPayoutStatus = "PENDING" | "PAID" | "FAILED";
export type AgentPayoutPaymentMethod =
  "NEFT" | "IMPS" | "UPI" | "RTGS" | "CHEQUE" | "CASH" | "OTHER";

export type AgentPayout = {
  id: string;
  deliveryAgentId: string;
  /** Gross earnings in the payout. */
  amount: number;
  /** TDS u/s 194C deducted (agents are contractors). */
  tdsAmount: number;
  tdsRatePercent: number | null;
  /** What the agent is paid: gross less TDS. */
  netAmount: number;
  periodStart: string;
  periodEnd: string;
  status: AgentPayoutStatus;
  paymentMethod: AgentPayoutPaymentMethod | null;
  paymentReferenceNumber: string | null;
  proofOfPaymentUrl: string | null;
  remarks: string | null;
  failureReason: string | null;
  paidAt: string | null;
  createdAt: string;
  agentName?: string | null;
  agentHubOrZone?: string | null;
};

export type AgentEarning = {
  id: string;
  deliveryAgentId: string;
  sourceType: "DELIVERY" | "PICKUP";
  sourceId: string;
  amount: number;
  status: "PENDING" | "SETTLED";
  payoutId: string | null;
  earnedAt: string;
};

export type BankDetails = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string | null;
  /** For TDS u/s 194C: without it the higher s.206AA rate is deducted. */
  pan?: string | null;
};

export type CashDepositStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type CashDeposit = {
  id: string;
  deliveryAgentId: string;
  amount: number;
  expectedAmount: number;
  /** Declared minus expected (negative = short), computed by the backend. */
  discrepancyAmount: number;
  /** True when the gap exceeds the backend's review tolerance. */
  hasDiscrepancy: boolean;
  status: CashDepositStatus;
  note: string | null;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  deliveryAgent?: { id: string; fullName: string; hubOrZone: string };
};
