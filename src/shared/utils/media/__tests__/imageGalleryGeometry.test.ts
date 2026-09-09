import { describe, expect, it } from "vitest";
import {
  clampPercent,
  originFromPointer,
  resolveStageGesture,
} from "../imageGalleryGeometry";

describe("clampPercent", () => {
  it("keeps in-range values unchanged", () => {
    expect(clampPercent(50)).toBe(50);
  });
  it("clamps below zero and above one hundred", () => {
    expect(clampPercent(-10)).toBe(0);
    expect(clampPercent(140)).toBe(100);
  });
});

describe("originFromPointer", () => {
  const rect = {
    width: 200,
    height: 100,
    left: 10,
    top: 20,
  } as DOMRect;

  it("maps a pointer to a percentage origin", () => {
    expect(originFromPointer(110, 70, rect)).toEqual({ x: 50, y: 50 });
  });
  it("returns the center for a zero-sized rect", () => {
    const empty = { width: 0, height: 0, left: 0, top: 0 } as DOMRect;
    expect(originFromPointer(5, 5, empty)).toEqual({ x: 50, y: 50 });
  });
});

describe("resolveStageGesture", () => {
  it("reports tap for small unmoved releases", () => {
    expect(
      resolveStageGesture({ dx: 2, dy: 1, wasZooming: false, moved: false }),
    ).toBe("tap");
  });
  it("suppresses tap after visible movement", () => {
    expect(
      resolveStageGesture({ dx: 2, dy: 1, wasZooming: false, moved: true }),
    ).toBe("none");
  });
  it("detects horizontal swipes past the threshold", () => {
    expect(
      resolveStageGesture({ dx: -80, dy: 4, wasZooming: false, moved: true }),
    ).toBe("swipe-next");
    expect(
      resolveStageGesture({ dx: 80, dy: 4, wasZooming: false, moved: true }),
    ).toBe("swipe-prev");
  });
  it("never reports tap or swipe while zooming", () => {
    expect(
      resolveStageGesture({ dx: 0, dy: 0, wasZooming: true, moved: false }),
    ).toBe("none");
  });
});
