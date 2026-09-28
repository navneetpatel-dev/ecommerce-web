import type { ProductListItem } from "@/shared/api/types";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/**
 * Session-scoped compare tray persistence. Storage is never trusted: a parse
 * failure, a cleared store, or a private-mode quota error all degrade to an
 * empty tray instead of breaking the PLP.
 */
export function readStoredCompare(): ProductListItem[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.COMPARE_SELECTION);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProductListItem[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredCompare(products: ProductListItem[]): void {
  try {
    if (products.length === 0) {
      window.sessionStorage.removeItem(STORAGE_KEYS.COMPARE_SELECTION);
      return;
    }
    window.sessionStorage.setItem(
      STORAGE_KEYS.COMPARE_SELECTION,
      JSON.stringify(products),
    );
  } catch {
    /* Storage unavailable (private mode / quota) — the tray stays in memory. */
  }
}
