import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { CategoryTaxSection } from "../../components/categories/CategoryTaxSection.component";
import { TaxCategoryFocus } from "../../components/tax/TaxCategoryFocus.component";
import { TaxRuleFormFields } from "../../components/tax/TaxRuleFormFields.component";
import { emptyTaxRuleValues } from "../../utils/tax/taxRuleForm";
import { taxPathForCategory } from "../../utils/tax/taxPath";

let permissions: string[] = [];
vi.mock("@/shared/hooks/auth/usePermissions.hook", () => ({
  usePermissions: () => ({
    hasPermission: (k: string) => permissions.includes(k),
  }),
}));
vi.mock("@/features/products", () => ({
  CategoryPickerSelect: () => <div>PICKER</div>,
}));

afterEach(() => {
  permissions = [];
});

const gst = {
  percent: 5,
  source: "default",
  fromCategoryName: null,
  priceBandThreshold: null,
  percentAbove: null,
} as const;

describe("Manage tax button in the category dialog", () => {
  it("people who manage tax get a button to this category on the Tax page", () => {
    permissions = [PERMISSIONS.TAX_MANAGE];
    render(<CategoryTaxSection categoryId="c 1" gst={gst} />);
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: LABELS.categoryManageTax }),
    ).toHaveAttribute("href", taxPathForCategory("c 1"));
    expect(taxPathForCategory("c 1")).toBe("/admin/tax?categoryId=c%201");
  });

  it("others see the rate and a hint, no button", () => {
    render(<CategoryTaxSection categoryId="c1" gst={gst} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(LABELS.categoryTaxManageHint)).toBeInTheDocument();
  });
});

describe("Tax page banner for one category", () => {
  const effective = {
    categoryId: "c1",
    categoryName: "Home",
    gstPercentage: 5,
    source: "default",
    fromCategoryName: null,
  } as never;
  const props = (over: Record<string, unknown>) => ({
    status: "ready" as const,
    effective,
    ownRule: null,
    sourceText: "The platform default rule",
    onEditRule: vi.fn(),
    onSetOwnRate: vi.fn(),
    onClear: vi.fn(),
    ...over,
  });

  it("without its own rule it offers to set one; with one, to edit it", () => {
    const first = props({});
    const { unmount } = render(<TaxCategoryFocus {...first} />);
    expect(screen.getByText("Tax for Home")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.taxFocusSetOwn }),
    );
    expect(first.onSetOwnRate).toHaveBeenCalled();
    unmount();
    const second = props({ ownRule: { id: "r" } });
    render(<TaxCategoryFocus {...second} />);
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.taxFocusEditRule }),
    );
    expect(second.onEditRule).toHaveBeenCalled();
  });

  it("the close button clears the filter; an unknown category says so", async () => {
    const shown = props({});
    const { unmount } = render(<TaxCategoryFocus {...shown} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(shown.onClear).toHaveBeenCalled();
    unmount();
    render(
      <TaxCategoryFocus {...props({ status: "notFound", effective: null })} />,
    );
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        LABELS.taxFocusNotFound,
      ),
    );
  });
});

describe("tax rule form in three groups", () => {
  it("scope, rate and price band each have a titled section; the band hint belongs to its section", () => {
    render(
      <TaxRuleFormFields
        values={emptyTaxRuleValues()}
        category={null}
        errors={{}}
        nonStandardRate={false}
        ratePercent={18}
        onPatch={vi.fn()}
        onSelectCategory={vi.fn()}
        onClearCategory={vi.fn()}
      />,
    );
    for (const title of [
      LABELS.taxRuleSectionScope,
      LABELS.taxRuleSectionRate,
      LABELS.taxRuleSectionBand,
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(screen.getByText(LABELS.gstPriceBandHint)).toBeInTheDocument();
    expect(
      screen.getByText("Customers pay 18% GST on top of the price."),
    ).toBeInTheDocument();
  });
});
