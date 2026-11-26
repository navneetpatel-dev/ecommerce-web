import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { FileUpload } from "@/shared/components/FileUpload";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import { ProductCategoryOption } from "../../components/product-editor/ProductCategoryOption.component";

const bulk = vi.fn();
vi.mock("@/shared/hooks/uploads/useUploads.hook", () => ({
  usePresignUpload: () => ({ mutateAsync: vi.fn(), isPending: false }),
  usePresignUploadBulk: () => ({ mutateAsync: bulk, isPending: false }),
}));

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

const MAX = PRODUCT_FIELD_LIMITS.IMAGES_MAX;
const urls = (count: number) =>
  Array.from({ length: count }, (_, i) => `https://cdn.test/img-${i}.jpg`);
const jpeg = (name: string) => new File(["x"], name, { type: "image/jpeg" });

function renderImages(attached: string[], onUploaded = vi.fn()) {
  const view = render(
    <FileUpload
      mode="multiple"
      entityType={UPLOAD_ENTITY.PRODUCTS}
      entityId="draft-1"
      purpose={UPLOAD_PURPOSE.IMAGES}
      valueUrls={attached}
      onUploaded={onUploaded}
      label="Product images"
      variant="card"
      removable
      maxFiles={MAX}
      markFirstAsMain
    />,
    { wrapper },
  );
  return { ...view, onUploaded };
}

beforeEach(() => bulk.mockReset());

describe("product image limit (10)", () => {
  it("is 10, the same as the API", () => {
    expect(MAX).toBe(10);
  });

  it("shows how many are used and marks the first as the main image", () => {
    renderImages(urls(3));
    expect(screen.getByText("3 / 10 images")).toBeInTheDocument();
    expect(screen.getAllByText(LABELS.mainImage)).toHaveLength(1);
  });

  it("at the limit the picker is disabled and says so", () => {
    renderImages(urls(MAX));
    expect(screen.getByText("10 / 10 images")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: LABELS.uploadFiles }),
    ).toBeDisabled();
  });

  it("refuses a selection that would go over the limit, without uploading anything", () => {
    const { container } = renderImages(urls(8));
    const input = container.querySelector(
      "input[type=file]",
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [jpeg("a.jpg"), jpeg("b.jpg"), jpeg("c.jpg")] },
    });
    expect(
      screen.getByText("You can add up to 10 images (2 more)."),
    ).toBeInTheDocument();
    expect(bulk).not.toHaveBeenCalled();
  });

  it("Remove drops that image from the list", () => {
    const { onUploaded } = renderImages(urls(3));
    fireEvent.click(
      screen.getAllByRole("button", { name: LABELS.removeFile })[1]!,
    );
    expect(onUploaded).toHaveBeenCalledWith([
      "https://cdn.test/img-0.jpg",
      "https://cdn.test/img-2.jpg",
    ]);
  });
});

describe("the category in the picker", () => {
  it("shows its name with no hyphen prefix, and the no-image placeholder when it has no picture", () => {
    render(
      <ProductCategoryOption name="Accessories" depth={1} imageUrl={null} />,
    );
    expect(screen.getByText("Accessories")).toBeInTheDocument();
    expect(screen.queryByText(/—/)).toBeNull();
    expect(
      screen.getByRole("img", { name: LABELS.imageNotAvailable }),
    ).toBeInTheDocument();
  });
});

describe("GST next to each category", () => {
  it("shows the rate beside the name", () => {
    render(
      <ProductCategoryOption name="Cookware" depth={1} gst={{ percent: 12 }} />,
    );
    expect(screen.getByText("12% GST")).toBeInTheDocument();
  });

  it("a rate that changes with price shows the range and explains it on hover", () => {
    render(
      <ProductCategoryOption
        name="Footwear"
        gst={{ percent: 5, abovePercent: 12, threshold: 1000 }}
      />,
    );
    const badge = screen.getByText("5–12% GST");
    expect(badge).toHaveAttribute(
      "title",
      expect.stringContaining("12% above"),
    );
  });

  it("without a rate (still loading) there is no badge", () => {
    render(<ProductCategoryOption name="Toys" gst={null} />);
    expect(screen.queryByText(/GST/)).toBeNull();
  });
});
