import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ReviewMediaItem } from "@/shared/api/types";
import { ReviewMediaGallery } from "../ReviewMediaGallery.component";

const photo = (n: number): ReviewMediaItem =>
  ({ type: "IMAGE", url: `https://example.com/p${n}.jpg` }) as ReviewMediaItem;

describe("ReviewMediaGallery viewer", () => {
  it("steps through every item and disables the arrows at each end", () => {
    render(<ReviewMediaGallery media={[photo(1), photo(2), photo(3)]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open photo 1" }));
    const dialog = screen.getByRole("dialog");
    const prev = within(dialog).getByRole("button", {
      name: "Previous photo or video",
    });
    const next = within(dialog).getByRole("button", {
      name: "Next photo or video",
    });

    expect(within(dialog).getByText("1 / 3")).toBeInTheDocument();
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();

    fireEvent.click(next);
    expect(within(dialog).getByText("2 / 3")).toBeInTheDocument();
    expect(prev).toBeEnabled();

    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByText("3 / 3")).toBeInTheDocument();
    expect(next).toBeDisabled();

    // Already on the last one: another → stays put (no wrap to the first).
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByText("3 / 3")).toBeInTheDocument();

    fireEvent.click(
      within(dialog).getByRole("button", { name: "Show item 1 of 3" }),
    );
    expect(within(dialog).getByText("1 / 3")).toBeInTheDocument();
  });

  it("shows no arrows or counter for a single photo", () => {
    render(<ReviewMediaGallery media={[photo(1)]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open photo 1" }));
    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).queryByRole("button", { name: /Next photo/ }),
    ).toBeNull();
    expect(within(dialog).queryByText("1 / 1")).toBeNull();
  });
});
