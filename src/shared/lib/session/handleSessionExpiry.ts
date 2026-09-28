import { ERROR_MESSAGES } from "@/shared/constants/http/errors";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { isDefinitiveAuthFailure } from "@/shared/utils/auth/authSessionError";

/** One prompt per expiry burst: several in-flight queries fail together. */
const PROMPT_THROTTLE_MS = 10_000;
let lastPromptAt = 0;

/**
 * A definitive auth failure mid-session (the refresh token is gone too) means
 * nothing on the page can recover by itself: every retry fails. Clear the
 * session, say so once, and hand the user a one-tap way back to where they were
 * — otherwise checkout just shows a generic error and work is lost.
 *
 * Returns true when the error was an auth failure (the caller's own error
 * handling can then stay quiet if it wants to).
 */
export function handleSessionExpiry(error: unknown): boolean {
  if (!isDefinitiveAuthFailure(error)) return false;

  const now = Date.now();
  if (now - lastPromptAt < PROMPT_THROTTLE_MS) return true;
  lastPromptAt = now;

  useAuthStore.getState().clearSession();
  const returnTo =
    typeof window === "undefined"
      ? PATHS.login
      : `${window.location.pathname}${window.location.search}`;

  notifyError(ERROR_MESSAGES.SESSION_EXPIRED, {
    label: LABELS.logIn,
    href: PATHS.loginWithRedirect(returnTo),
  });
  return true;
}

/** Test seam: forget the throttle window. */
export function resetSessionExpiryThrottle(): void {
  lastPromptAt = 0;
}
