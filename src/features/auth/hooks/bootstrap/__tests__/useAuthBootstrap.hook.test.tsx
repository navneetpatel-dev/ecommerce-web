import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { ApiError } from "@/shared/types/apiError.types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { adminUser, wrapper } from "./authBootstrapFixtures";

vi.mock("@/shared/api/client/internal/sessionRefresh", () => ({
  refreshSessionOrThrow: vi.fn(),
}));

vi.mock("../../../api/auth/auth.api", () => ({
  authApi: {
    me: vi.fn(),
  },
}));

import { refreshSessionOrThrow } from "@/shared/api/client/internal/sessionRefresh";
import { authApi } from "../../../api/auth/auth.api";
import {
  storeSessionAdapter,
  useAuthBootstrap,
} from "../useAuthBootstrap.hook";

describe("storeSessionAdapter + useAuthBootstrap (F-14 / F-25)", () => {
  const assign = vi.fn();

  beforeEach(() => {
    vi.mocked(refreshSessionOrThrow).mockReset();
    vi.mocked(authApi.me).mockReset();
    assign.mockReset();
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      currentUser: null,
      authBootstrapped: false,
    });
    vi.stubGlobal("location", {
      ...window.location,
      assign,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("never writes the access token to localStorage", () => {
    storeSessionAdapter.persistAccessToken("secret-token");

    expect(useAuthStore.getState().accessToken).toBe("secret-token");
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
  });

  it("bootstraps an authenticated session from a refresh cookie with no stored access token", async () => {
    vi.mocked(refreshSessionOrThrow).mockImplementation(async () => {
      storeSessionAdapter.persistAccessToken("refreshed-token");
    });
    vi.mocked(authApi.me).mockResolvedValue(adminUser);

    renderHook(() => useAuthBootstrap(), { wrapper });

    await waitFor(() => {
      expect(useAuthStore.getState().authBootstrapped).toBe(true);
    });

    expect(useAuthStore.getState().accessToken).toBe("refreshed-token");
    expect(useAuthStore.getState().currentUser).toEqual(adminUser);
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) ?? "null"),
    ).toEqual(adminUser);
  });

  it("resolves as guest when silent refresh fails and does not retry forever", async () => {
    vi.mocked(refreshSessionOrThrow).mockRejectedValue(
      new ApiError(ERROR_CODES.UNAUTHORIZED, "expired"),
    );

    renderHook(() => useAuthBootstrap(), { wrapper });

    await waitFor(() => {
      expect(useAuthStore.getState().authBootstrapped).toBe(true);
    });

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(refreshSessionOrThrow).toHaveBeenCalledTimes(1);
    expect(authApi.me).not.toHaveBeenCalled();
  });
});
