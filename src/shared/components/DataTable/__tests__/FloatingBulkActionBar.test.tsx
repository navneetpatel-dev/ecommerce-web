import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FloatingBulkActionBar } from "../FloatingBulkActionBar.component";

describe("FloatingBulkActionBar", () => {
  it("renders nothing when selectedCount is 0", () => {
    const { container } = render(
      <FloatingBulkActionBar selectedCount={0} onClearSelection={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders count and item label when selectedCount > 0", () => {
    render(
      <FloatingBulkActionBar
        selectedCount={5}
        totalCount={20}
        onClearSelection={vi.fn()}
      >
        <button type="button">Export</button>
      </FloatingBulkActionBar>,
    );

    expect(
      screen.getByRole("region", { name: "Bulk actions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("of 20")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("calls onClearSelection when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <FloatingBulkActionBar
        selectedCount={3}
        onClearSelection={handleClear}
      />,
    );

    const clearBtn = screen.getByRole("button", { name: "Clear selection" });
    await user.click(clearBtn);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
