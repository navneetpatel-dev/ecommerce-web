import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { ProductPoliciesSection } from "../VendorProductCreateForm/ProductPoliciesSection.component";

vi.mock("@/features/products", () => ({
  PRODUCT_FIELD_LIMITS: { HSN_MAX: 8, NOTE_MAX: 500, WARRANTY_MONTHS_MAX: 120 },
}));

function signIn(role: CurrentUser["role"]) {
  useAuthStore.setState({
    accessToken: "t",
    currentUser: {
      id: "u1",
      email: "u@example.com",
      name: "U",
      phone: null,
      role,
      permissions: [],
      vendorId: "v1",
      emailVerified: true,
    },
  });
}

const values = {
  deliveryNote: "",
  returnNote: "",
  warrantyMonths: "",
  warrantyType: "",
  hsnCode: "610910",
  codMode: "inherit",
} as never;

function renderSection() {
  render(
    <ProductPoliciesSection
      values={values}
      disabled={false}
      getError={() => undefined}
      patchValues={() => undefined}
    />,
  );
}

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, currentUser: null });
});

describe("product policies: owner-only fields", () => {
  it("vendor staff cannot edit the HSN code or the COD option, and are told why", () => {
    signIn("VENDOR_STAFF");
    renderSection();
    expect(screen.getByDisplayValue("610910")).toBeDisabled();
    expect(
      screen.getAllByText(LABELS.productOwnerOnlyHint).length,
    ).toBeGreaterThanOrEqual(2);
    const codSelect = screen
      .getAllByRole("combobox")
      .find((el) => el.textContent?.includes(LABELS.productCodInherit));
    expect(codSelect).toBeDisabled();
  });

  it("the store owner can edit both", () => {
    signIn("VENDOR_OWNER");
    renderSection();
    expect(screen.getByDisplayValue("610910")).toBeEnabled();
    expect(
      screen.queryByText(LABELS.productOwnerOnlyHint),
    ).not.toBeInTheDocument();
    const codSelect = screen
      .getAllByRole("combobox")
      .find((el) => el.textContent?.includes(LABELS.productCodInherit));
    expect(codSelect).toBeEnabled();
  });
});
