import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "../SearchInput.component";

describe("SearchInput", () => {
  it("renders with placeholder and shortcut hint when empty", () => {
    render(
      <SearchInput placeholder="Search items..." value="" onChange={vi.fn()} />,
    );

    const input = screen.getByPlaceholderText("Search items...");
    expect(input).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear search/i }),
    ).not.toBeInTheDocument();
  });

  it("renders clear button when value is present", () => {
    render(
      <SearchInput
        placeholder="Search items..."
        value="laptop"
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /clear search/i }),
    ).toBeInTheDocument();
  });

  it("calls onClear and onChange when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onChange = vi.fn();

    render(
      <SearchInput
        placeholder="Search items..."
        value="shoes"
        onChange={onChange}
        onClear={onClear}
      />,
    );

    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    await user.click(clearBtn);

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: "" },
      }),
    );
  });

  it("clears value when Escape key is pressed with content", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onChange = vi.fn();

    render(
      <SearchInput
        placeholder="Search items..."
        value="watch"
        onChange={onChange}
        onClear={onClear}
      />,
    );

    const input = screen.getByPlaceholderText("Search items...");
    await user.type(input, "{Escape}");

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
