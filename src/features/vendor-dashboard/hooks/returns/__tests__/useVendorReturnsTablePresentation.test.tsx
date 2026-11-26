import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CurrentUser, ReturnRequest } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useVendorReturnsTablePresentation } from "../useVendorReturnsTablePresentation.hook";

function signIn(role: CurrentUser["role"], permissions: string[]) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions,
      vendorId: "v1",
      emailVerified: true,
    },
  });
}

/** A returned parcel that has arrived and is neither restocked nor disputed yet. */
const arrived = {
  id: "11111111-2222-3333-4444-555555555555",
  status: "RECEIVED",
  reasonCode: "DEFECTIVE",
  receivedAt: "2026-11-20T10:00:00.000Z",
  restockedAt: null,
  disputedAt: null,
  disputeStatus: null,
} as unknown as ReturnRequest;

const OWNER = [
  "product.create",
  "product.update",
  "suborder.manage",
  "payout.view",
];
const STAFF = ["product.update", "suborder.manage"];

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("vendor returns: who can dispute", () => {
  it("the store owner can restock and dispute an arrived return", () => {
    signIn("VENDOR_OWNER", OWNER);
    const { result } = renderHook(() =>
      useVendorReturnsTablePresentation([arrived]),
    );
    expect(result.current.rows[0]?.canRestock).toBe(true);
    expect(result.current.rows[0]?.canDispute).toBe(true);
  });

  it("vendor staff can still restock but cannot dispute", () => {
    signIn("VENDOR_STAFF", STAFF);
    const { result } = renderHook(() =>
      useVendorReturnsTablePresentation([arrived]),
    );
    expect(result.current.rows[0]?.canRestock).toBe(true);
    expect(result.current.rows[0]?.canDispute).toBe(false);
  });

  it("an already disputed return stays non-disputable for the owner too", () => {
    signIn("VENDOR_OWNER", OWNER);
    const disputed = {
      ...arrived,
      disputedAt: "2026-11-21T10:00:00.000Z",
      disputeStatus: "PENDING",
    } as unknown as ReturnRequest;
    const { result } = renderHook(() =>
      useVendorReturnsTablePresentation([disputed]),
    );
    expect(result.current.rows[0]?.canDispute).toBe(false);
    expect(result.current.rows[0]?.isDisputed).toBe(true);
  });
});
