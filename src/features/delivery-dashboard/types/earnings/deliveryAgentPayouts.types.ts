export type AgentPayoutStatus = "PENDING" | "PAID" | "FAILED";
export type AgentPayoutPaymentMethod =
  "NEFT" | "IMPS" | "UPI" | "RTGS" | "CHEQUE" | "CASH" | "OTHER";

export type AgentPayout = {
  id: string;
  deliveryAgentId: string;
  amount: number;
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
