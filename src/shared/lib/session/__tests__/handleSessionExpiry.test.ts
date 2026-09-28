import { describe, expect, it, beforeEach } from "vitest";
import {
  handleSessionExpiry,
  resetSessionExpiryThrottle,
} from "../handleSessionExpiry";
import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/http/errors";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useToastStore } from "@/shared/stores/notifications/toast.store";

function seedSignedInSession() {
  useAuthStore.setState({
    accessToken: "token",
    currentUser: { id: "u1", name: "Asha" } as never,
  });
}

function lastToast() {
  return useToastStore.getState().toasts.at(-1);
}

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  resetSessionExpiryThrottle();
  seedSignedInSession();
});

/**
 * A session that expires mid-visit used to surface as a generic error on
 * whatever request happened to fail first: the user was told nothing useful and
 * stayed on a page that could no longer load. Now it clears the session, says
 * so once, and offers the sign-in link that returns to where they were.
 */
describe("handleSessionExpiry", () => {
  it("clears the session and offers a way back for an auth failure", () => {
    const handled = handleSessionExpiry(
      new ApiError(ERROR_CODES.UNAUTHORIZED, "expired"),
    );

    expect(handled).toBe(true);
    expect(useAuthStore.getState().accessToken).toBeNull();

    const toast = lastToast();
    expect(toast?.kind).toBe("error");
    expect(toast?.message).toBe(ERROR_MESSAGES.SESSION_EXPIRED);
    expect(toast?.actionHref).toContain("/login?redirect=");
  });

  it("ignores failures that are not auth failures", () => {
    const handled = handleSessionExpiry(
      new ApiError(ERROR_CODES.REQUEST_FAILED, "boom"),
    );

    expect(handled).toBe(false);
    expect(useAuthStore.getState().accessToken).toBe("token");
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("prompts once per burst, however many requests fail together", () => {
    const error = new ApiError(ERROR_CODES.TOKEN_EXPIRED, "expired");

    handleSessionExpiry(error);
    handleSessionExpiry(error);
    handleSessionExpiry(error);

    expect(
      useToastStore
        .getState()
        .toasts.filter((t) => t.message === ERROR_MESSAGES.SESSION_EXPIRED),
    ).toHaveLength(1);
  });
});
