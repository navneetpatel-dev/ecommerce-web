import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import Link from "next/link";
import { ProductPreviewDialogShell } from "../../components/preview/ProductPreviewDialogShell.component";
import { useProductDetailContent } from "../../hooks/detail/useProductDetailContent.hook";

const navigation = vi.hoisted(() => ({ search: "create=1" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigation.search),
  usePathname: () => "/admin/products",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

const product = {
  id: "p",
  slug: "p",
  name: "Pot",
  basePrice: 10,
  displayPrice: 10,
  variants: [],
  images: [],
} as never;
const selection = {
  attributeGroups: {},
  currentPrice: 10,
  currentStock: 0,
  matchedVariant: null,
  selectedVariant: null,
  isAvailable: () => true,
  isActive: () => false,
  onSelectValue: vi.fn(),
};

describe("switching tabs on the product page", () => {
  it("in a preview the tab is kept in memory and the address never changes (the product dialog stays open)", () => {
    const replaceState = vi.spyOn(window.history, "replaceState");
    const { result } = renderHook(() =>
      useProductDetailContent({
        product,
        variantSelection: selection as never,
        preview: true,
      }),
    );
    act(() => result.current.setDetailTab("specifications"));
    expect(result.current.detailTab).toBe("specifications");
    expect(replaceState).not.toHaveBeenCalled();
    replaceState.mockRestore();
  });

  it("on the storefront the tab is still in the URL, so Back returns to it", () => {
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useProductDetailContent({
        product,
        variantSelection: selection as never,
      }),
    );
    act(() => result.current.setDetailTab("specifications"));
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(String(replaceState.mock.calls[0]![2])).toContain(
      "tab=specifications",
    );
    replaceState.mockRestore();
  });
});

describe("links inside a preview", () => {
  it("do not navigate away (the vendor, category and breadcrumb links of the page)", () => {
    render(
      <ProductPreviewDialogShell open onOpenChange={vi.fn()}>
        <Link href="/vendors/acme">Acme</Link>
      </ProductPreviewDialogShell>,
    );
    const link = screen.getByText("Acme");
    const notPrevented = fireEvent.click(link);
    expect(notPrevented).toBe(false);
  });
});
