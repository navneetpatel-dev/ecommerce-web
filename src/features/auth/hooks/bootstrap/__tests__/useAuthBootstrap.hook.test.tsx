import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { PATHS } from "@/shared/constants/paths/paths";
import { ERROR_CODES } from "@/shared/constants/http/errors";
import { ApiError } from "@/shared/types/apiError.types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { CurrentUser } from "@/shared/api/types";

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

const adminUser: CurrentUser = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Admin",
  phone: null,
  role: "SUPER_ADMIN",
  vendorId: null,
  emailVerified: true,
};

const impersonatedUser: CurrentUser = {
  id: "user-1",
  email: "shopper@example.com",
  name: "Shopper",
  phone: null,
  role: "CUSTOMER",
  vendorId: null,
  emailVerified: true,
  impersonatedBy: "admin-1",
};

function encodeJwt(payload: object): string {
  const json = JSON.stringify(payload);
  const base64 = btoa(json).replace(/\+/g, "-").replace(/\//g, "_");
  return `hdr.${base64}.sig`;
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

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
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) ?? "null")).toEqual(
      adminUser,
    );
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

  it("reverts to the stashed admin session instead of logging out when impersonation refresh is rejected", () => {
    useAuthStore.setState({
      accessToken: "impersonation-token",
      currentUser: impersonatedUser,
    });
    localStorage.setItem(
      STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION,
      JSON.stringify({ accessToken: "admin-token", user: adminUser }),
    );

    storeSessionAdapter.clearSession();

    expect(useAuthStore.getState().accessToken).toBe("admin-token");
    expect(useAuthStore.getState().currentUser).toEqual(adminUser);
    expect(
      localStorage.getItem(STORAGE_KEYS.IMPERSONATION_ORIGINAL_SESSION),
    ).toBeNull();
    expect(assign).toHaveBeenCalledWith(PATHS.admin.root);
  });

  it("fully logs out a non-impersonated expired session", () => {
    useAuthStore.setState({
      accessToken: "user-token",
      currentUser: { ...adminUser, role: "CUSTOMER" },
    });
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(adminUser));

    storeSessionAdapter.clearSession();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull();
    expect(assign).not.toHaveBeenCalled();
  });

  it("rejects a refreshed admin token while impersonating", () => {
    useAuthStore.setState({
      accessToken: "impersonation-token",
      currentUser: impersonatedUser,
    });
    const adminJwt = encodeJwt({ sub: "admin-1" });
    const impersonationJwt = encodeJwt({
      sub: "user-1",
      impersonatedBy: "admin-1",
    });

    expect(storeSessionAdapter.acceptRefreshedToken(adminJwt)).toBe(false);
    expect(storeSessionAdapter.acceptRefreshedToken(impersonationJwt)).toBe(
      true,
    );
  });
});
