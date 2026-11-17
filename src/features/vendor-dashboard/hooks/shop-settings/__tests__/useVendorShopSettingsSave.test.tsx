import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROLES } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { vendorApi } from "../../../api/overview/vendor.api";
import { useVendorShopSettingsSave } from "../useVendorShopSettingsForm/useVendorShopSettingsSave.hook";

vi.mock("../../../api/overview/vendor.api", () => ({
  vendorApi: { updateMyShop: vi.fn() },
}));

const baseOptions = {
  entityType: null,
  categoryIds: ["c1"],
  returnShippingFee: 40,
  codEnabled: true,
  payoutFrequency: null,
  bankDetails: {
    accountHolderName: "Acme",
    bankName: "HDFC",
    accountNumber: "123456789012",
    ifscCode: "HDFC0001234",
  },
  savedAccountNumber: "123456789012",
  confirmAccountNumber: "123456789012",
  logoUrl: null,
  bannerUrl: null,
  applyShop: vi.fn(),
  setReturnShippingFee: vi.fn(),
};

function ownerSession() {
  useAuthStore.setState({
    currentUser: { role: ROLES.VENDOR_OWNER },
  } as never);
}

describe("useVendorShopSettingsSave", () => {
  beforeEach(() => {
    ownerSession();
    vi.mocked(vendorApi.updateMyShop).mockReset();
    vi.mocked(vendorApi.updateMyShop).mockResolvedValue({} as never);
  });

  it("saves untouched bank details without asking to re-confirm", () => {
    const { result } = renderHook(() => useVendorShopSettingsSave(baseOptions));
    act(() => result.current.save());
    expect(vendorApi.updateMyShop).toHaveBeenCalledTimes(1);
  });

  it("blocks saving an edited account number that was not re-typed", () => {
    const { result } = renderHook(() =>
      useVendorShopSettingsSave({
        ...baseOptions,
        bankDetails: {
          ...baseOptions.bankDetails,
          accountNumber: "999999999999",
        },
        confirmAccountNumber: "123456789012",
      }),
    );
    act(() => result.current.save());
    expect(vendorApi.updateMyShop).not.toHaveBeenCalled();
    expect(result.current.message).toMatch(/do not match/i);
  });

  it("blocks a malformed account number or IFSC", () => {
    const badNumber = renderHook(() =>
      useVendorShopSettingsSave({
        ...baseOptions,
        bankDetails: { ...baseOptions.bankDetails, accountNumber: "12ab" },
        confirmAccountNumber: "12ab",
      }),
    );
    act(() => badNumber.result.current.save());
    expect(badNumber.result.current.message).toMatch(/9 to 18 digits/i);

    const badIfsc = renderHook(() =>
      useVendorShopSettingsSave({
        ...baseOptions,
        bankDetails: { ...baseOptions.bankDetails, ifscCode: "SBIN000000" },
      }),
    );
    act(() => badIfsc.result.current.save());
    expect(badIfsc.result.current.message).toMatch(/IFSC/i);
    expect(vendorApi.updateMyShop).not.toHaveBeenCalled();
  });

  it("clears the return-fee override without touching anything else", () => {
    const { result } = renderHook(() =>
      useVendorShopSettingsSave({
        ...baseOptions,
        bankDetails: { ...baseOptions.bankDetails, accountNumber: "12" },
      }),
    );
    act(() => result.current.clearOverride());
    expect(vendorApi.updateMyShop).toHaveBeenCalledWith({
      returnShippingFee: null,
    });
  });

  it("lets a logo upload save only the logo, never a half-typed bank account", () => {
    const { result } = renderHook(() =>
      useVendorShopSettingsSave({
        ...baseOptions,
        bankDetails: { ...baseOptions.bankDetails, accountNumber: "12" },
      }),
    );
    act(() => result.current.save({ logoUrl: "https://cdn/logo.png" }, true));
    expect(vendorApi.updateMyShop).toHaveBeenCalledWith({
      logoUrl: "https://cdn/logo.png",
    });
  });
});
