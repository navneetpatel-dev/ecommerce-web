import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageSizeSelector } from "../PageSizeSelector.component";

describe("PageSizeSelector", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders with current page size", () => {
    render(<PageSizeSelector pageSize={25} onPageSizeChange={vi.fn()} />);

    expect(screen.getByText("Rows per page:")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Select rows per page" }),
    ).toBeInTheDocument();
  });

  it("triggers onPageSizeChange when an option is selected", async () => {
    const user = userEvent.setup();
    const handleSizeChange = vi.fn();

    render(
      <PageSizeSelector pageSize={10} onPageSizeChange={handleSizeChange} />,
    );

    const trigger = screen.getByRole("combobox", {
      name: "Select rows per page",
    });
    await user.click(trigger);

    // Pick 50 from dropdown
    const option50 = screen.getByRole("option", { name: "50" });
    await user.click(option50);

    expect(handleSizeChange).toHaveBeenCalledWith(50);
  });
});
