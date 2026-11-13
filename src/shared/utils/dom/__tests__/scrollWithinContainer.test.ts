import { describe, expect, it, vi } from "vitest";
import { scrollWithinContainer } from "../scrollWithinContainer";

const rect = (left: number, top: number, width: number, height: number) =>
  ({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
  }) as DOMRect;

function setup(item: DOMRect) {
  const container = document.createElement("div");
  const child = document.createElement("button");
  container.getBoundingClientRect = () => rect(0, 0, 300, 80);
  child.getBoundingClientRect = () => item;
  container.scrollBy = vi.fn() as unknown as typeof container.scrollBy;
  const windowScroll = vi
    .spyOn(window, "scrollTo")
    .mockImplementation(() => undefined);
  return { container, child, windowScroll };
}

describe("scrollWithinContainer", () => {
  it("scrolls only the strip to reveal a thumbnail past its right edge", () => {
    const { container, child, windowScroll } = setup(rect(320, 0, 60, 60));
    scrollWithinContainer(container, child);
    expect(container.scrollBy).toHaveBeenCalledWith({
      left: 80,
      top: 0,
      behavior: "auto",
    });
    expect(windowScroll).not.toHaveBeenCalled();
  });

  it("does nothing when the thumbnail is already visible", () => {
    const { container, child } = setup(rect(100, 10, 60, 60));
    scrollWithinContainer(container, child);
    expect(container.scrollBy).not.toHaveBeenCalled();
  });
});
