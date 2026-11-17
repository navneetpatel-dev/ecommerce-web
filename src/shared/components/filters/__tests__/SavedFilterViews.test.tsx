import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SavedFilterViews } from "../SavedFilterViews.component";

describe("SavedFilterViews", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Default view button and allows clicking to apply defaults", async () => {
    const user = userEvent.setup();
    const handleApply = vi.fn();

    render(
      <SavedFilterViews
        storageKey="orders"
        currentValues={{ status: "COMPLETED" }}
        defaultValues={{ status: "" }}
        onApplyView={handleApply}
      />,
    );

    const defaultBtn = screen.getByRole("button", { name: "Default" });
    expect(defaultBtn).toBeInTheDocument();

    await user.click(defaultBtn);
    expect(handleApply).toHaveBeenCalledWith({ status: "" });
  });

  it("saves a new filter view and allows switching to it", async () => {
    const user = userEvent.setup();
    const handleApply = vi.fn();

    const { rerender } = render(
      <SavedFilterViews
        storageKey="orders"
        currentValues={{ status: "PENDING", priority: "HIGH" }}
        defaultValues={{ status: "", priority: "" }}
        onApplyView={handleApply}
      />,
    );

    // Click "Save view"
    const openSaveBtn = screen.getByRole("button", {
      name: "Save current filter view",
    });
    await user.click(openSaveBtn);

    // Type view name and submit
    const nameInput = screen.getByLabelText("View name");
    await user.type(nameInput, "Urgent Orders");

    const submitBtn = screen.getByRole("button", { name: "Save" });
    await user.click(submitBtn);

    // Check that the new view is rendered
    expect(
      screen.getByRole("button", { name: "Urgent Orders" }),
    ).toBeInTheDocument();

    // Now change currentValues to something else and click the saved view
    rerender(
      <SavedFilterViews
        storageKey="orders"
        currentValues={{ status: "" }}
        defaultValues={{ status: "" }}
        onApplyView={handleApply}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Urgent Orders" }));
    expect(handleApply).toHaveBeenCalledWith({
      status: "PENDING",
      priority: "HIGH",
    });
  });

  it("allows deleting a saved filter view", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "saved-filter-views:orders",
      JSON.stringify([
        {
          id: "1",
          name: "Test View",
          values: { status: "TEST" },
          createdAt: Date.now(),
        },
      ]),
    );

    render(
      <SavedFilterViews
        storageKey="orders"
        currentValues={{}}
        onApplyView={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Test View" }),
    ).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", {
      name: "Delete view Test View",
    });
    await user.click(deleteBtn);

    expect(
      screen.queryByRole("button", { name: "Test View" }),
    ).not.toBeInTheDocument();
  });

  it("calls onShare or copies link when share view button is clicked", async () => {
    const user = userEvent.setup();
    const handleShare = vi.fn();

    render(
      <SavedFilterViews
        storageKey="orders"
        currentValues={{ status: "PENDING", search: "nike" }}
        onApplyView={vi.fn()}
        onShare={handleShare}
      />,
    );

    const shareBtn = screen.getByRole("button", {
      name: "Share current filter view link",
    });
    expect(shareBtn).toBeInTheDocument();

    await user.click(shareBtn);
    expect(handleShare).toHaveBeenCalledTimes(1);
    expect(handleShare.mock.calls[0][0]).toContain("status=PENDING");
    expect(handleShare.mock.calls[0][0]).toContain("search=nike");
  });
});
