import { walletApi } from "../../api/wallet/wallet.api";

const RECHARGE_IDEMPOTENCY_PREFIX = "wallet-recharge-idempotency:";
const RECHARGE_SESSION_PREFIX = "wallet-recharge-session:";

export function getOrCreateIdempotencyKey(amountInr: number): string {
  const storageKey = `${RECHARGE_IDEMPOTENCY_PREFIX}${amountInr}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const key = crypto.randomUUID();
  sessionStorage.setItem(storageKey, key);
  return key;
}

export function clearRechargeSession(amountInr: number, rechargeId?: string) {
  sessionStorage.removeItem(`${RECHARGE_IDEMPOTENCY_PREFIX}${amountInr}`);
  if (rechargeId)
    sessionStorage.removeItem(`${RECHARGE_SESSION_PREFIX}${rechargeId}`);
}

export function markRechargeSessionStarted(
  rechargeId: string,
  amountInr: number,
) {
  sessionStorage.setItem(
    `${RECHARGE_SESSION_PREFIX}${rechargeId}`,
    String(amountInr),
  );
}

export async function pollRechargeUntilTerminal(
  rechargeId: string,
  maxAttempts = 12,
  intervalMs = 2500,
): Promise<"PAID" | "FAILED" | "EXPIRED" | "PENDING"> {
  for (let i = 0; i < maxAttempts; i += 1) {
    const row = await walletApi.getRechargeStatus(rechargeId);
    const status = String(row.status ?? "").toUpperCase();
    if (status === "PAID" || status === "FAILED" || status === "EXPIRED") {
      return status as "PAID" | "FAILED" | "EXPIRED";
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return "PENDING";
}
