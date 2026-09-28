import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SortBar } from "../SortBar.component";
import { PaginationResultSummary } from "@/shared/components/navigation/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/**
 * Filtering and paging change the grid without a navigation, and the route
 * announcer only fires on pathname changes — so these counts must be live
 * regions or assistive-tech users hear nothing.
 */
describe("listing result counts are announced", () => {
  it("announces the product count through a polite live region", () => {
    render(
      <SortBar
        sort="trending"
        totalProducts={240}
        isFetching={false}
        onSortChange={vi.fn()}
      />,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toHaveTextContent("240");
  });

  it("announces the paginated summary for tables and vendor lists", () => {
    render(<PaginationResultSummary from={1} to={24} total={240} />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(
      formatLabel(LABELS.showingResults, { from: 1, to: 24, total: 240 }),
    );
  });

  it("renders nothing at all when there are no results to announce", () => {
    const { container } = render(
      <PaginationResultSummary from={0} to={0} total={0} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
