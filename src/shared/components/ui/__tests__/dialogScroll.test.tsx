import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  withoutOwnScroll,
} from "../dialog";

describe("one scrollbar per dialog", () => {
  it("drops the scroll classes a caller puts on the dialog box (also with breakpoints), keeps the rest", () => {
    expect(
      withoutOwnScroll(
        "max-h-[90vh] max-w-2xl overflow-y-auto sm:overflow-auto overflow-hidden p-0",
      ),
    ).toBe("max-h-[90vh] max-w-2xl overflow-hidden p-0");
    expect(withoutOwnScroll(undefined)).toBeUndefined();
    expect(withoutOwnScroll("overflow-x-auto max-w-lg")).toBe(
      "overflow-x-auto max-w-lg",
    );
  });

  it("the dialog box itself never scrolls; its body does", () => {
    render(
      <Dialog open>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogTitle>Title</DialogTitle>
          <p>content</p>
        </DialogContent>
      </Dialog>,
    );
    const box = screen.getByRole("dialog");
    expect(box.className).not.toMatch(/overflow-y-auto/);
    expect(box.className).toMatch(/overflow-hidden/);
    expect(screen.getByText("content").closest("div")!.className).toMatch(
      /overflow-y-auto/,
    );
  });
});
