import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LABELS, ROLES } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useCommissionLock } from "../../hooks/categories/useCommissionLock.hook";
import { categoryEditRateChange } from "../../utils/categories/categoryRateChange";

const category = { id: "c1", name: "Shoes", parentId: "p1", commissionRate: 8 };
const signIn = (role: string, permissions: string[] = []) =>
  useAuthStore.setState({ currentUser: { role, permissions } as never });

describe("category commission", () => {
  beforeEach(() => signIn(ROLES.ADMIN_CATALOG_MANAGER, ["category.manage"]));

  it("is locked for the Catalog Manager, with the reason shown", () => {
    const { result } = renderHook(() => useCommissionLock());
    expect(result.current).toEqual({
      locked: true,
      hint: LABELS.categoryCommissionLockedHint,
    });
  });

  it("is open to a Super Admin and to a role granted product pricing", () => {
    signIn(ROLES.SUPER_ADMIN);
    expect(renderHook(() => useCommissionLock()).result.current.locked).toBe(
      false,
    );
    signIn(ROLES.ADMIN_CATALOG_MANAGER, [PERMISSIONS.PRODUCT_PRICING]);
    expect(renderHook(() => useCommissionLock()).result.current.locked).toBe(
      false,
    );
  });

  it("checks nothing while the rate and parent are the saved ones", () => {
    expect(
      categoryEditRateChange(category, {
        parentId: "p1",
        commissionRate: "8.00",
      }),
    ).toBeNull();
  });

  it("checks a new or cleared rate, with the new parent if that changed too", () => {
    expect(
      categoryEditRateChange(category, {
        parentId: "p1",
        commissionRate: "0",
      }),
    ).toEqual({ kind: "edit", categoryId: "c1", commissionRate: "0" });
    expect(
      categoryEditRateChange(category, { parentId: "", commissionRate: "" }),
    ).toEqual({ kind: "edit", categoryId: "c1", parentId: "none" });
  });

  it("checks a move on its own as before", () => {
    expect(
      categoryEditRateChange(category, {
        parentId: "p2",
        commissionRate: "8",
      }),
    ).toEqual({ kind: "reparent", categoryId: "c1", parentId: "p2" });
  });
});
