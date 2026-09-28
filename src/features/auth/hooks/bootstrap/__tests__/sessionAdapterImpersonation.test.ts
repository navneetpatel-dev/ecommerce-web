import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import {
  adminUser,
  encodeJwt,
  impersonatedUser,
} from "./authBootstrapFixtures";

vi.mock("@/shared/api/client/internal/sessionRefresh", () => ({
  refreshSessionOrThrow: vi.fn(),
}));

vi.mock("../../../api/auth/auth.api", () => ({
  authApi: { me: vi.fn() },
}));

import { storeSessionAdapter } from "../useAuthBootstrap.hook";

describe("storeSessionAdapter impersonation handling (F-14 / F-25)", () => {
  const assign = vi.fn();

  beforeEach(() => {
    assign.mockReset();
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      currentUser: null,
      authBootstrapped: false,
    });
    vi.stubGlobal("location", { ...window.location, assign });
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
