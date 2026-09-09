import { create } from "zustand";

interface CartDrawerState {
  isOpen: boolean;
  mutationError: string | null;
  open: () => void;
  close: () => void;
  setMutationError: (message: string | null) => void;
}

export const useCartDrawerStore = create<CartDrawerState>((set) => ({
  isOpen: false,
  mutationError: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setMutationError: (mutationError) => set({ mutationError }),
}));
