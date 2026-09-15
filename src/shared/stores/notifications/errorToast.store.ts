import { create } from "zustand";

interface ErrorToastState {
  open: boolean;
  message: string;
  /** Bumped on every `showError` call — used as a React `key` so a second error replacing an
   * already-open toast remounts it, restarting Radix's auto-dismiss timer, instead of inheriting
   * whatever time was left on the first message's timer (which could vanish it almost instantly). */
  id: number;
  showError: (message: string) => void;
  dismiss: () => void;
}

/**
 * Global, imperative "something failed" notice — for actions with no other error surface (e.g. a
 * row-action file download that isn't behind a confirm dialog or a list with its own error
 * banner). Call `notifyError(message)` from anywhere, including outside React (a hook's catch
 * block); `ErrorToastContainer` (mounted once in app-providers.tsx) renders the current message.
 */
export const useErrorToastStore = create<ErrorToastState>((set) => ({
  open: false,
  message: "",
  id: 0,
  showError: (message) =>
    set((state) => ({ open: true, message, id: state.id + 1 })),
  dismiss: () => set({ open: false }),
}));

export function notifyError(message: string): void {
  useErrorToastStore.getState().showError(message);
}
