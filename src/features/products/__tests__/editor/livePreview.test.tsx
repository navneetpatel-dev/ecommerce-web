import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
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
