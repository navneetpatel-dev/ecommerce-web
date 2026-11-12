import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/** Long enough to sign in or register; a dismissed prompt does not linger. */
const PENDING_TTL_MS = 15 * 60 * 1000;

/**
 * The product a guest tapped the heart on before the sign-in prompt (C-05). It lives in
 * sessionStorage so it survives the sign-in redirect; storage failures just drop it.
 */
export function rememberPendingWishlist(
  productId: string,
  now = Date.now(),
): void {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEYS.PENDING_WISHLIST,
      JSON.stringify({ productId, at: now }),
    );
  } catch {
    /* Storage unavailable: the heart simply is not saved after sign-in. */
  }
}

/** Takes the pending product if it is this one and recent, so it is saved once. */
export function takePendingWishlist(
  productId: string,
  now = Date.now(),
): boolean {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.PENDING_WISHLIST);
    if (!raw) return false;
    const pending = JSON.parse(raw) as { productId?: string; at?: number };
    if (pending.productId !== productId) return false;
    window.sessionStorage.removeItem(STORAGE_KEYS.PENDING_WISHLIST);
    return typeof pending.at === "number" && now - pending.at <= PENDING_TTL_MS;
  } catch {
    return false;
  }
}
