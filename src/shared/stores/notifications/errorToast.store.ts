import { useToastStore } from "./toast.store";
import type { ToastActionSpec } from "./toast.store";

/**
 * Global, imperative "something failed" notice — for actions with no other
 * error surface (e.g. a row-action file download that isn't behind a confirm
 * dialog or a list with its own error banner).
 *
 * Kept as its own module (same signature as before) because it is imported by
 * 19 call sites; the queue itself now lives in `toast.store`, which renders
 * every severity through ToastStackContainer. The optional action carries a way
 * forward, e.g. "Sign in again" after the session expires.
 */
export function notifyError(message: string, action?: ToastActionSpec): void {
  const actionFields = !action
    ? {}
    : "href" in action
      ? { actionLabel: action.label, actionHref: action.href }
      : { actionLabel: action.label, action: action.onClick };

  useToastStore.getState().push({ kind: "error", message, ...actionFields });
}
