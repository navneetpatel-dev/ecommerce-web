import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileActionBar } from "../MobileActionBar.component";
import { LABELS } from "@/shared/constants/labels";

function renderBar(props: Partial<Parameters<typeof MobileActionBar>[0]> = {}) {
  return render(
    <MobileActionBar
      compareMode={false}
      onOpenFilters={vi.fn()}
      onOpenSort={vi.fn()}
      onToggleCompareMode={vi.fn()}
      {...props}
    />,
  );
}

/**
 * One implementation now serves both listing surfaces — they had drifted, and
 * the category page's Sort button ignored the "search results can't be
 * re-sorted" state that the product page honoured.
 */
describe("MobileActionBar", () => {
  it("offers filters, sort and compare", () => {
    renderBar();

    expect(
      screen.getByRole("button", { name: LABELS.filters }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: LABELS.sort })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: LABELS.compare }),
    ).toBeInTheDocument();
  });

  it("disables sort with an explanation while search results are showing", () => {
    renderBar({ sortDisabled: true });

    const sort = screen.getByRole("button", { name: LABELS.sort });
    expect(sort).toBeDisabled();
    expect(sort).toHaveAttribute("title", LABELS.sortUnavailableDuringSearch);
  });

  it("exposes compare mode as a pressed toggle", () => {
    const { rerender } = renderBar({ compareMode: false });
    expect(
      screen.getByRole("button", { name: LABELS.compare }),
    ).toHaveAttribute("aria-pressed", "false");

    rerender(
      <MobileActionBar
        compareMode
        onOpenFilters={vi.fn()}
        onOpenSort={vi.fn()}
        onToggleCompareMode={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: LABELS.compare }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
