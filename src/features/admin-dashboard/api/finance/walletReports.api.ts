import type { ReportRange } from "./reports.api";

/**
 * Wallet-side report shapes, split out of `reports.api.ts` to keep both files
 * under the line ceiling. `reports.api.ts` re-exports these, so components
 * still import them from there.
 */

export type WalletLiabilityRow = {
  userId: string;
  balance: number;
  asOf: string;
  purchasedPoints?: number;
  promotionalPoints?: number;
};

export type WalletLiabilityReport = {
  totalLiability: number;
  customerCount: number;
  totalPointsLiability?: number;
  purchasedPointsLiability?: number;
  promotionalPointsLiability?: number;
  rows: WalletLiabilityRow[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type WalletRechargeRow = {
  id: string;
  userId: string;
  amountInr: number;
  pointsCredited: number;
  status: string;
  razorpayOrderId: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type WalletRechargeReport = {
  from: string;
  to: string;
  totalInrCollected: number;
  successCount: number;
  failedCount: number;
  pointsIssued: number;
  rows: WalletRechargeRow[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CashbackWriteOffRow = {
  id: string;
  userId: string;
  originalClawbackAmount: number;
  recoveredAmount: number;
  writtenOffAmount: number;
  bornBy: "PLATFORM" | "VENDOR";
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
};

export type CashbackWriteOffReport = {
  from: string;
  to: string;
  bornBy: "PLATFORM" | "VENDOR" | null;
  recoveredTotal: number;
  writtenOffTotal: number;
  rows: CashbackWriteOffRow[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type WriteOffReportRange = ReportRange & {
  bornBy?: "PLATFORM" | "VENDOR";
};
