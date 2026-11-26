import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productsApi } from "../../api/listing/products.api";
import { createProductWithImages } from "../../utils/product-editor/createProductWithImages";

const notifyError = vi.fn();
vi.mock("@/shared/stores/notifications/errorToast.store", () => ({
  notifyError: (message: string) => notifyError(message),
}));

const body = { name: "Lamp" } as never;
const variant = { sku: "S1", attributes: {}, price: 10, stock: 1 };

beforeEach(() => {
  notifyError.mockReset();
  vi.spyOn(productsApi, "create").mockResolvedValue({ id: "p1" } as never);
  vi.spyOn(productsApi, "createOnBehalf").mockResolvedValue({
    id: "p2",
  } as never);
  vi.spyOn(productsApi, "addVariant").mockResolvedValue({} as never);
  vi.spyOn(productsApi, "addImage").mockResolvedValue({} as never);
});
afterEach(() => vi.restoreAllMocks());

describe("createProductWithImages", () => {
  it("a vendor creates their own product (no vendor id), then its variants and images, first image primary", async () => {
    await createProductWithImages(body, ["a.jpg", "b.jpg"], {
      variants: [variant],
    });
    expect(productsApi.create).toHaveBeenCalledWith(body);
    expect(productsApi.createOnBehalf).not.toHaveBeenCalled();
    expect(productsApi.addVariant).toHaveBeenCalledWith("p1", variant);
    expect(productsApi.addImage).toHaveBeenNthCalledWith(1, "p1", {
      url: "a.jpg",
      isPrimary: true,
    });
    expect(productsApi.addImage).toHaveBeenNthCalledWith(2, "p1", {
      url: "b.jpg",
      isPrimary: false,
    });
  });

  it("an admin lists the product for the chosen vendor", async () => {
    await createProductWithImages(body, [], {
      onBehalf: true,
      vendorId: "v9",
      variants: [variant],
    });
    expect(productsApi.createOnBehalf).toHaveBeenCalledWith("v9", body);
    expect(productsApi.create).not.toHaveBeenCalled();
    expect(productsApi.addVariant).toHaveBeenCalledWith("p2", variant);
  });

  it("a failing variant or image is counted, never stops the others, and never recreates the product", async () => {
    vi.spyOn(productsApi, "addVariant")
      .mockRejectedValueOnce(new Error("dup sku"))
      .mockResolvedValue({} as never);
    vi.spyOn(productsApi, "addImage").mockRejectedValue(new Error("bad"));
    await createProductWithImages(body, ["a.jpg", "b.jpg"], {
      variants: [variant, { ...variant, sku: "S2" }],
    });
    expect(productsApi.addVariant).toHaveBeenCalledTimes(2);
    expect(productsApi.create).toHaveBeenCalledTimes(1);
    expect(notifyError).toHaveBeenCalledTimes(2);
    expect(notifyError.mock.calls[0]![0]).toContain("1 variant");
  });
});
