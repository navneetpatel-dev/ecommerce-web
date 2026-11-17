import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InlineStatusDropdown } from "../InlineStatusDropdown.component";

const options = [
  { value: "OPEN", label: "Open", tone: "info" as const },
  { value: "IN_PROGRESS", label: "In Progress", tone: "warning" as const },
  { value: "RESOLVED", label: "Resolved", tone: "success" as const },
];

describe("InlineStatusDropdown", () => {
  it("renders current status badge with accessible label", () => {
    render(
      <InlineStatusDropdown
        currentStatus="OPEN"
        options={options}
        onStatusChange={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: /Change status: currently Open/i,
    });
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("opens popover with options and triggers onStatusChange when an option is selected", async () => {
    const user = userEvent.setup();
    const handleStatusChange = vi.fn();

    render(
      <InlineStatusDropdown
        currentStatus="OPEN"
        options={options}
        onStatusChange={handleStatusChange}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: /Change status: currently Open/i,
    });
    await user.click(trigger);

    expect(screen.getByText("Update status")).toBeInTheDocument();
    const resolvedBtn = screen.getByRole("button", { name: /Resolved/i });
    await user.click(resolvedBtn);

    expect(handleStatusChange).toHaveBeenCalledWith("RESOLVED");
  });
});
