import { render, screen } from "@testing-library/react";
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

  it("shows active count badge and reset button when activeCount > 0", async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(
      <CollapsibleTableFilters activeCount={2} onClear={onClear}>
        <div>Inputs</div>
      </CollapsibleTableFilters>,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    const resetBtn = screen.getByRole("button", { name: /reset/i });
    expect(resetBtn).toBeInTheDocument();

    await user.click(resetBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
