import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CurrentUser } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { ProductPoliciesSection } from "../../components/product-editor/ProductPoliciesSection.component";

vi.mock("../../constants/listing-form/productFields", () => ({
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

describe("product policies: vendor fields", () => {
  it("the vendor can edit the HSN code and the COD option", () => {
    signIn("VENDOR_OWNER");
    renderSection();
    expect(screen.getByDisplayValue("610910")).toBeEnabled();
    expect(
      screen.queryByText(LABELS.pricingLockedHint),
    ).not.toBeInTheDocument();
    const codSelect = screen
      .getAllByRole("combobox")
      .find((el) => el.textContent?.includes(LABELS.productCodInherit));
    expect(codSelect).toBeEnabled();
  });
});

describe("product policies: lock decided by the editor (platform admins)", () => {
  it("a platform admin locked out of a live vendor product sees the explanation and disabled fields", () => {
    signIn("SUPER_ADMIN");
    render(
      <ProductPoliciesSection
        values={values}
        disabled={false}
        getError={() => undefined}
        patchValues={() => undefined}
        pricingLock={{ locked: true, hint: LABELS.pricingLockedHint }}
      />,
    );
    expect(screen.getByDisplayValue("610910")).toBeDisabled();
    expect(
      screen.getAllByText(LABELS.pricingLockedHint).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("an explicit unlock leaves the fields editable", () => {
    signIn("SUPER_ADMIN");
    render(
      <ProductPoliciesSection
        values={values}
        disabled={false}
        getError={() => undefined}
        patchValues={() => undefined}
        pricingLock={{ locked: false }}
      />,
    );
    expect(screen.getByDisplayValue("610910")).toBeEnabled();
  });
});
