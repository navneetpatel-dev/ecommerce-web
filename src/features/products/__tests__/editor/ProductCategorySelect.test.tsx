import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LABELS } from "@/shared/constants/labels";
import { productsApi } from "../../api/listing/products.api";
import { ProductCategorySelect } from "../../components/product-editor/ProductCategorySelect.component";

const item = (id: string, name: string, depth: number, extra = {}) => ({
  id,
  name,
  depth,
  imageUrl: null,
  path: null,
  gstPercentage: 12,
  priceBandThreshold: null,
  gstPercentageAbove: null,
  ...extra,
});

beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
});

let picker: ReturnType<typeof vi.spyOn>;
afterEach(() => vi.restoreAllMocks());
beforeEach(() => {
  // The page cache is shared between cases, so each case asks a different question (search term).
  picker = vi.spyOn(productsApi, "categoryPicker").mockImplementation(
    async (params) =>
      ({
        items: [
          item("home", "Home & Kitchen", 0),
          item("cook", "Cookware", 1, {
            gstPercentage: 5,
            gstPercentageAbove: 12,
            priceBandThreshold: 1000,
          }),
        ],
        page: params.page,
        totalPages: 3,
        total: 70,
      }) as never,
  );
});

function renderSelect(
  over: Partial<Parameters<typeof ProductCategorySelect>[0]> = {},
) {
  const onSelect = vi.fn();
  render(
    <ProductCategorySelect
      value=""
      selected={null}
      onSelect={onSelect}
      {...over}
    />,
  );
  return { onSelect };
}

describe("the category dropdown", () => {
  it("requests nothing until it is opened", () => {
    renderSelect();
    expect(picker).not.toHaveBeenCalled();
  });

  it("opening it loads only the first page, sized for scrolling", async () => {
    renderSelect();
    await userEvent.click(
      screen.getByRole("button", { name: LABELS.selectCategory }),
    );
    await waitFor(() => expect(picker).toHaveBeenCalledTimes(1));
    expect(picker).toHaveBeenCalledWith({
      page: 1,
      limit: 25,
      search: undefined,
    });
  });

  it("shows each category with its GST (a price-dependent rate as a range) and no hyphen prefixes", async () => {
    renderSelect();
    await userEvent.click(
      screen.getByRole("button", { name: LABELS.selectCategory }),
    );
    expect(await screen.findByText("Home & Kitchen")).toBeInTheDocument();
    expect(screen.getByText("12% GST")).toBeInTheDocument();
    expect(screen.getByText("5–12% GST")).toBeInTheDocument();
    expect(screen.queryByText(/—/)).toBeNull();
  });

  it("choosing a row hands the whole category (name, GST) to the form", async () => {
    const { onSelect } = renderSelect();
    await userEvent.click(
      screen.getByRole("button", { name: LABELS.selectCategory }),
    );
    await userEvent.click(
      await screen.findByRole("option", { name: /Cookware/ }),
    );
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "cook",
        name: "Cookware",
        gst: { percent: 5, abovePercent: 12, threshold: 1000 },
      }),
    );
  });

  it("an already chosen category labels the closed field without loading anything (editing)", () => {
    renderSelect({
      value: "cook",
      selected: { id: "cook", name: "Cookware", gst: { percent: 12 } },
    });
    expect(
      screen.getByRole("button", { name: /Cookware · 12% GST/ }),
    ).toBeInTheDocument();
    expect(picker).not.toHaveBeenCalled();
  });
});
