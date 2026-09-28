import { create } from "zustand";
import type { ProductListItem } from "@/shared/api/types";
import { MAX_COMPARED_PRODUCTS } from "../../constants/compare/compare";
import { readStoredCompare, writeStoredCompare } from "./compareStorage";

interface CompareState {
  /** Compare-selection mode toggle shown on the PLP toolbar. */
  mode: boolean;
  products: ProductListItem[];
  toggleMode: () => void;
  toggle: (product: ProductListItem) => void;
  clear: () => void;
  /** Called on mount — sessionStorage cannot be read during SSR. */
  hydrate: () => void;
}

let hydrated = false;

/**
 * Cross-route compare tray (Rule: one source of truth). Lives outside the PLP
 * so a selection survives navigation, pagination and a hard refresh of
 * /compare; every write is persisted to sessionStorage.
 */
export const useCompareStore = create<CompareState>((set, get) => ({
  mode: false,
  products: [],
  toggleMode: () => set({ mode: !get().mode }),
  toggle: (product) => {
    const current = get().products;
    const alreadySelected = current.some((item) => item.id === product.id);
    const next = alreadySelected
      ? current.filter((item) => item.id !== product.id)
      : current.length >= MAX_COMPARED_PRODUCTS
        ? current
        : [...current, product];
    writeStoredCompare(next);
    set({ products: next });
  },
  clear: () => {
    writeStoredCompare([]);
    set({ products: [] });
  },
  hydrate: () => {
    if (hydrated) return;
    hydrated = true;
    set({ products: readStoredCompare() });
  },
}));
