import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CollapsibleTableFilters } from "../CollapsibleTableFilters.component";

describe("CollapsibleTableFilters", () => {
  it("renders collapsed by default and does not show children", () => {
    render(
      <CollapsibleTableFilters>
        <div data-testid="filter-inputs">Inputs</div>
      </CollapsibleTableFilters>,
    );

    expect(
      screen.getByRole("button", { name: /filters/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("filter-inputs")).not.toBeInTheDocument();
  });

  it("expands to show children when toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleTableFilters>
        <div data-testid="filter-inputs">Inputs</div>
      </CollapsibleTableFilters>,
    );

    const toggleBtn = screen.getByRole("button", { name: /filters/i });
    await user.click(toggleBtn);

    expect(screen.getByTestId("filter-inputs")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hide filters/i }),
    ).toBeInTheDocument();
  });

  it("shows active count badge and clear button when activeCount > 0", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(
      <CollapsibleTableFilters activeCount={2} onClear={onClear}>
        <div>Inputs</div>
      </CollapsibleTableFilters>,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: /clear filters/i });
    expect(clearBtn).toBeInTheDocument();

    await user.click(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("does not render a count badge when activeCount is 0", () => {
    render(
      <CollapsibleTableFilters activeCount={0} onClear={vi.fn()}>
        <div>Inputs</div>
      </CollapsibleTableFilters>,
    );

    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear filters/i }),
    ).not.toBeInTheDocument();
  });

  it("renders result count when resultCount prop is passed", () => {
    render(
      <CollapsibleTableFilters resultCount={{ count: 5, total: 20 }}>
        <div>Inputs</div>
      </CollapsibleTableFilters>,
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(/of 20/)).toBeInTheDocument();
  });

  it("collapses when toggle button is clicked again", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleTableFilters defaultOpen>
        <div data-testid="filter-inputs">Inputs</div>
      </CollapsibleTableFilters>,
    );

    expect(screen.getByTestId("filter-inputs")).toBeInTheDocument();
    const toggleBtn = screen.getByRole("button", { name: /hide filters/i });
    await user.click(toggleBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("filter-inputs")).not.toBeInTheDocument();
    });
  });

  it("expands filter drawer and focuses search input when / is pressed", async () => {
    const user = userEvent.setup();

    render(
      <CollapsibleTableFilters>
        <input type="search" placeholder="Search data..." />
      </CollapsibleTableFilters>,
    );

    expect(
      screen.queryByPlaceholderText("Search data..."),
    ).not.toBeInTheDocument();

    await user.keyboard("/");

    expect(screen.getByPlaceholderText("Search data...")).toBeInTheDocument();
  });
});

describe("CollapsibleTableFilters (controlled)", () => {
  it("follows the open prop and reports toggles via onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <CollapsibleTableFilters open={false} onOpenChange={onOpenChange}>
        <input aria-label="inner" />
      </CollapsibleTableFilters>,
    );

    expect(screen.queryByLabelText("inner")).toBeNull();
    await user.click(screen.getByRole("button", { name: /filters/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <CollapsibleTableFilters open onOpenChange={onOpenChange}>
        <input aria-label="inner" />
      </CollapsibleTableFilters>,
    );
    expect(screen.getByLabelText("inner")).toBeInTheDocument();
  });
});
