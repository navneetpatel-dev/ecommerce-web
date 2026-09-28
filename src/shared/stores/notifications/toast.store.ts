import { create } from "zustand";
import { TOAST_MAX_VISIBLE } from "@/shared/constants/timing/timing";

export type ToastKind = "success" | "info" | "error";

export interface AppToast {
  /** Monotonic id — also the React key, so a replacing toast remounts and its
   *  auto-dismiss timer restarts instead of inheriting the previous one's. */
  id: number;
  kind: ToastKind;
  message: string;
  /** Optional single action (spec §4.4): a link, or an in-place callback (undo). */
  actionLabel?: string;
  actionHref?: string;
  action?: () => void;
}

/** A toast action is either navigation (href) or an in-place command (undo). */
export type ToastActionSpec =
  { label: string; href: string } | { label: string; onClick: () => void };

interface ToastState {
  toasts: AppToast[];
  push: (toast: Omit<AppToast, "id">) => void;
  dismiss: (id: number) => void;
  /** Runs the toast's callback action, if it has one, then removes the toast. */
  runAction: (id: number) => void;
}

function actionFields(action?: ToastActionSpec) {
  if (!action) return {};
  return "href" in action
    ? { actionLabel: action.label, actionHref: action.href }
    : { actionLabel: action.label, action: action.onClick };
}

/**
 * App-wide toast queue (success / info / error). Mounted once by
 * ToastStackContainer in app-providers.tsx; `notifyError`/`notifySuccess`/
 * `notifyInfo` push into it from anywhere, including outside React.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (toast) => {
    const next: AppToast = { ...toast, id: (get().toasts.at(-1)?.id ?? 0) + 1 };
    // Oldest first-out once the visible cap is exceeded.
    set({ toasts: [...get().toasts, next].slice(-TOAST_MAX_VISIBLE) });
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  runAction: (id) => {
    const toast = get().toasts.find((t) => t.id === id);
    toast?.action?.();
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

export function notifySuccess(message: string, action?: ToastActionSpec): void {
  useToastStore.getState().push({
    kind: "success",
    message,
    ...actionFields(action),
  });
}

export function notifyInfo(message: string, action?: ToastActionSpec): void {
  useToastStore.getState().push({
    kind: "info",
    message,
    ...actionFields(action),
  });
}
