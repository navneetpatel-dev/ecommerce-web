import { describe, expect, it } from "vitest";
import { galleryEdges, galleryStep } from "../galleryStep";

describe("galleryStep", () => {
  it("stops at both ends instead of wrapping", () => {
    expect(galleryStep(0, -1, 4)).toBe(0);
    expect(galleryStep(3, 1, 4)).toBe(3);
    expect(galleryStep(1, 1, 4)).toBe(2);
    expect(galleryStep(2, -1, 4)).toBe(1);
  });

  it("reports which directions are open", () => {
    expect(galleryEdges(0, 3)).toEqual({ canPrev: false, canNext: true });
    expect(galleryEdges(1, 3)).toEqual({ canPrev: true, canNext: true });
    expect(galleryEdges(2, 3)).toEqual({ canPrev: true, canNext: false });
    expect(galleryEdges(0, 1)).toEqual({ canPrev: false, canNext: false });
  });
});
