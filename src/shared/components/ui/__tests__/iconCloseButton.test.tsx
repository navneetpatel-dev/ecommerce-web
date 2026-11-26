import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { IconCloseButton } from "../icon-close-button";

describe("IconCloseButton", () => {
  it("is a named button that calls back, defaulting to Close", () => {
    const onClick = vi.fn();
    render(<IconCloseButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses the given label and does nothing when disabled", () => {
    const onClick = vi.fn();
    render(<IconCloseButton label="Remove file" disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove file" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("each variant has its own size; the overlay sits in the corner of its tile", () => {
    render(
      <>
        <IconCloseButton variant="dialog" label="a" />
        <IconCloseButton variant="overlay" label="b" />
        <IconCloseButton variant="inline" label="c" />
      </>,
    );
    expect(screen.getByLabelText("a").className).toContain("size-9");
    expect(screen.getByLabelText("b").className).toMatch(
      /absolute.*right-1\.5.*top-1\.5/,
    );
    expect(screen.getByLabelText("c").className).toContain("size-6");
  });
});

describe("the dialog's close button", () => {
  it("closes the dialog", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
