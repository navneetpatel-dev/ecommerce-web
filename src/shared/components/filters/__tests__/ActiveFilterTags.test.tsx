import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActiveFilterTags } from "../ActiveFilterTags.component";

describe("ActiveFilterTags", () => {
  it("renders active tags with label and value", () => {
    const handleRemove = vi.fn();
    render(
      <ActiveFilterTags
        tags={[
          {
            id: "status",
            label: "Status",
            valueLabel: "Confirmed",
            onRemove: handleRemove,
          },
        ]}
      />,
    );

    expect(screen.getByText("Filtered by:")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <ActiveFilterTags
        tags={[
          {
            id: "status",
            label: "Status",
            valueLabel: "Confirmed",
            onRemove: handleRemove,
          },
        ]}
      />,
    );

    const removeBtn = screen.getByRole("button", {
      name: "Remove filter Status Confirmed",
    });
    await user.click(removeBtn);

    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("calls onClearAll when Clear all is clicked", async () => {
    const user = userEvent.setup();
    const handleClearAll = vi.fn();

    render(
      <ActiveFilterTags
        tags={[
          {
            id: "status",
            label: "Status",
            valueLabel: "Confirmed",
            onRemove: vi.fn(),
          },
          {
            id: "priority",
            label: "Priority",
            valueLabel: "High",
            onRemove: vi.fn(),
          },
        ]}
        onClearAll={handleClearAll}
      />,
    );

    const clearAllBtn = screen.getByRole("button", { name: "Clear all" });
    await user.click(clearAllBtn);

    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });
});
