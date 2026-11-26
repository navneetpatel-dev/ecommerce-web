import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { emptyProductListingValues } from "../../types/listing-form/productListingForm.types";
import { emptyVariantDraft } from "../../utils/product-editor/variantDrafts";
import { buildPreviewProduct } from "../../utils/preview/buildPreviewProduct";
import { DetailTabsSection } from "../../components/detail/ProductDetailContent/DetailTabsSection.component";
import { ProductHeadingBlock } from "../../components/detail/ProductDetailContent/ProductHeadingBlock.component";
import { ProductEditorDialogBody } from "../../components/product-editor/ProductEditorDialogBody.component";

vi.mock("@/features/reviews", () => ({
  ProductReviewsContainer: () => <div>REVIEWS</div>,
}));
vi.mock("@/features/productQna", () => ({
  ProductQnaContainer: () => <div>QNA</div>,
}));
vi.mock("../../components/product-editor/ProductEditorForm.component", () => ({
  ProductEditorForm: ({ onPreview }: { onPreview?: () => void }) => (
    <div data-testid="form">
      <button type="button" onClick={onPreview}>
        {"Preview"}
      </button>
    </div>
  ),
}));
vi.mock(
  "../../components/preview/ProductLivePreviewDialog.component",
  async () => {
    const { Dialog, DialogContent, DialogTitle } =
      await import("@/shared/components/ui/dialog");
    return {
      default: (props: {
        values: { name: string };
        open: boolean;
        onOpenChange: (open: boolean) => void;
      }) => (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
          <DialogContent>
            <DialogTitle>Preview</DialogTitle>
            <div data-testid="preview">PREVIEW {props.values.name}</div>
            <button
              type="button"
              data-testid="close-preview"
              onClick={() => props.onOpenChange(false)}
            >
              x
            </button>
          </DialogContent>
        </Dialog>
      ),
    };
  },
);

const pricing = {
  gstPercentage: 18,
  displayPrice: 1180,
  compareAtPrice: 1499,
  showMrp: true,
  discountPercent: 21,
  savings: 319,
  variantDisplayPrices: [1180, 2360],
};

const filled = {
  ...emptyProductListingValues("c1"),
  name: "  Steel Pot ",
  price: "1000",
  compareAtPrice: "1499",
  description: "A 5 litre pot.",
  brand: "Hawkins",
  tagsInput: "steel, pot",
  highlights: ["Induction ready", " "],
  specs: [
    { key: "Material", value: "Steel" },
    { key: "", value: "x" },
  ],
  codMode: "on" as const,
};

describe("the product as the customer page would receive it, from the form", () => {
  const base = {
    values: filled,
    mode: "create" as const,
    imageUrls: ["https://cdn/a.jpg", "https://cdn/b.jpg"],
    variantRows: [],
    saved: null,
    category: { id: "c1", name: "Cookware" },
    pricing,
  };

  it("takes the API's customer price, MRP, % off and GST (nothing calculated here)", () => {
    const product = buildPreviewProduct(base);
    expect([
      product.displayPrice,
      product.compareAtPrice,
      product.showMrp,
      product.discountPercent,
      product.gstPercentage,
    ]).toEqual([1180, 1499, true, 21, 18]);
  });

  it("uses the typed details, tidied: trimmed name, no blank highlights or incomplete specs", () => {
    const product = buildPreviewProduct(base);
    expect(product.name).toBe("Steel Pot");
    expect(product.highlights).toEqual(["Induction ready"]);
    expect(product.specs).toEqual({ Material: "Steel" });
    expect(product.tags).toEqual(["steel", "pot"]);
    expect(product.categoryName).toBe("Cookware");
    expect(product.codEnabled).toBe(true);
  });

  it("the first uploaded image is the main one; there are no ratings or reviews", () => {
    const product = buildPreviewProduct(base);
    expect(product.images.map((image) => [image.url, image.isPrimary])).toEqual(
      [
        ["https://cdn/a.jpg", true],
        ["https://cdn/b.jpg", false],
      ],
    );
    expect(product.imageUrl).toBe("https://cdn/a.jpg");
    expect([product.avgRating, product.reviewCount]).toEqual([0, 0]);
  });

  it("variant rows become variants with the API's GST-inclusive price; blank rows are ignored", () => {
    const rows = [
      {
        ...emptyVariantDraft(),
        sku: "S1",
        price: "1000",
        stock: "5",
        options: "Size: M",
      },
      {
        ...emptyVariantDraft(),
        sku: "S2",
        price: "2000",
        stock: "3",
        options: "Size: L",
      },
      emptyVariantDraft(),
    ];
    const product = buildPreviewProduct({ ...base, variantRows: rows });
    expect(
      product.variants.map((v) => [
        v.sku,
        v.attributes,
        v.displayPrice,
        v.stock,
      ]),
    ).toEqual([
      ["S1", { Size: "M" }, 1180, 5],
      ["S2", { Size: "L" }, 2360, 3],
    ]);
    expect(product.stock).toBe(8);
  });

  it("an empty form still previews (a placeholder name), and editing uses the saved images and variants", () => {
    expect(
      buildPreviewProduct({
        ...base,
        values: emptyProductListingValues(),
        pricing: null,
        imageUrls: [],
      }).name,
    ).toBe(LABELS.previewNamePlaceholder);
    const saved = {
      id: "p9",
      slug: "pot",
      status: "LIVE",
      images: [{ id: "i1", url: "https://cdn/saved.jpg", isPrimary: true }],
      variants: [
        {
          id: "v1",
          sku: "OLD",
          attributes: {},
          price: 10,
          stock: 2,
          lowStockAt: 5,
        },
      ],
      vendor: { id: "v", businessName: "Acme" },
    };
    const product = buildPreviewProduct({
      ...base,
      mode: "edit",
      saved: saved as never,
    });
    expect([
      product.id,
      product.status,
      product.images[0]!.url,
      product.variants[0]!.sku,
      product.vendor?.businessName,
    ]).toEqual(["p9", "LIVE", "https://cdn/saved.jpg", "OLD", "Acme"]);
  });
});

describe("a preview leaves out what a new product does not have", () => {
  const product = {
    id: "p",
    slug: "p",
    name: "Pot",
    description: "d",
    highlights: [],
    specs: {},
    tags: [],
  } as never;
  const tabs = (showCommunity: boolean) =>
    render(
      <DetailTabsSection
        product={product}
        detailTab="description"
        onTabChange={vi.fn()}
        resolvedVariant={null}
        categoryName={null}
        displayStock={0}
        reviewCount={0}
        showCommunity={showCommunity}
      />,
    );

  it("no Reviews or Questions tabs in a preview; both are there on the real page", () => {
    tabs(false);
    expect(
      screen.getByRole("tab", { name: LABELS.description }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: LABELS.specifications }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: LABELS.questionsAndAnswers }),
    ).toBeNull();
    expect(screen.queryByRole("tab", { name: /Reviews/ })).toBeNull();
  });

  it("the storefront still shows them", () => {
    tabs(true);
    expect(
      screen.getByRole("tab", { name: LABELS.questionsAndAnswers }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Reviews/ })).toBeInTheDocument();
  });

  it("no star rating row in a preview", () => {
    const heading = (hideRating: boolean) =>
      render(
        <ProductHeadingBlock
          product={product}
          sellerScore={null}
          avgRating={0}
          reviewCount={0}
          onReviewsClick={vi.fn()}
          hideRating={hideRating}
        />,
      );
    const hidden = heading(true);
    const withoutRating = hidden.container.innerHTML;
    hidden.unmount();
    const shown = heading(false);
    expect(shown.container.innerHTML.length).toBeGreaterThan(
      withoutRating.length,
    );
  });
});

describe("the Preview button in the product dialog", () => {
  const formProps = {
    values: { name: "Pot" },
    imageUrls: [],
    category: { selected: null, onSelect: vi.fn() },
  } as never;
  const open = () =>
    render(
      <Dialog open>
        <DialogContent>
          <ProductEditorDialogBody
            mode="create"
            formProps={formProps}
            onCancel={vi.fn()}
          />
        </DialogContent>
      </Dialog>,
    );

  it("opens the customer page for what is typed, over the form, which stays where it was", async () => {
    open();
    expect(screen.queryByTestId("preview")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.previewAsCustomer }),
    );
    expect(await screen.findByTestId("preview")).toHaveTextContent(
      "PREVIEW Pot",
    );
    expect(screen.getByTestId("form")).toBeInTheDocument();
  });

  it("closing the preview leaves the product dialog open", async () => {
    open();
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.previewAsCustomer }),
    );
    await screen.findByTestId("preview");
    fireEvent.click(screen.getByTestId("close-preview"));
    await waitFor(() => expect(screen.queryByTestId("preview")).toBeNull());
    expect(screen.getByTestId("form")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
