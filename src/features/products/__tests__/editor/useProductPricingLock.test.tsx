import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useProductPricingLock } from "../../hooks/product-editor/useProductPricingLock.hook";

function signIn(
  role: CurrentUser["role"],
  permissions: string[],
  vendorId: string | null,
) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions,
      vendorId,
      emailVerified: true,
    } as CurrentUser,
  });
}

const live = { status: "LIVE", listedByPlatform: false, vendorId: "v1" };
const platformDraft = {
  status: "DRAFT",
  listedByPlatform: true,
  vendorId: "v1",
};
const lockFor = (product?: Parameters<typeof useProductPricingLock>[0]) =>
  renderHook(() => useProductPricingLock(product)).result.current;

beforeEach(() =>
  useAuthStore.setState({ accessToken: null, currentUser: null }),
);

describe("the price lock mirrors the API's pricing policy", () => {
  it("vendor owner: free, no reason", () => {
    signIn("VENDOR_OWNER", ["product.create"], "v1");
    expect(lockFor(live)).toEqual({
      lock: { locked: false },
      reasonRequired: false,
    });
  });

  it("no product.pricing and no store: locked on a live vendor product, with the explanation", () => {
    signIn("CUSTOMER", ["product.manage", "product.create"], null);
    expect(lockFor(live).lock).toEqual({
      locked: true,
      hint: LABELS.pricingLockedHint,
    });
  });

  it("free while creating, on a platform-listed draft, and on the platform's own products", () => {
    signIn("CUSTOMER", ["product.manage", "product.create"], null);
    expect(lockFor(undefined).lock.locked).toBe(false);
    expect(lockFor(platformDraft)).toEqual({
      lock: { locked: false },
      reasonRequired: false,
    });
    expect(lockFor({ ...live, vendorId: null }).lock.locked).toBe(false);
  });

  it("a platform-listed product that went live is locked without product.pricing", () => {
    signIn("CUSTOMER", ["product.manage"], null);
    expect(lockFor({ ...platformDraft, status: "LIVE" }).lock.locked).toBe(
      true,
    );
  });

  it("product.pricing (Super Admin): unlocked, but a reason is required on a live vendor product", () => {
    signIn("SUPER_ADMIN", [], null);
    expect(lockFor(live)).toEqual({
      lock: { locked: false },
      reasonRequired: true,
    });
    expect(lockFor(platformDraft).reasonRequired).toBe(false);
  });
});
