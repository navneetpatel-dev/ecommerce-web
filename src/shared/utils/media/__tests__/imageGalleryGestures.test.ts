import { describe, it } from "vitest";
import assert from "node:assert/strict";
import {
  applyPinchScale,
  clampPan,
  detectHorizontalSwipe,
  distanceBetween,
  maxPanOffset,
} from "../imageGalleryGestures";

describe("imageGalleryGestures", () => {
  it("detects horizontal swipes and ignores vertical movement", () => {
    assert.equal(
      detectHorizontalSwipe({ x: 0, y: 0 }, { x: -80, y: 4 }, 48),
      1,
    );
    assert.equal(
      detectHorizontalSwipe({ x: 0, y: 0 }, { x: 80, y: -6 }, 48),
      -1,
    );
    assert.equal(
      detectHorizontalSwipe({ x: 0, y: 0 }, { x: 20, y: 0 }, 48),
      null,
    );
    assert.equal(
      detectHorizontalSwipe({ x: 0, y: 0 }, { x: -80, y: 90 }, 48),
      null,
    );
  });

  it("computes pinch distance and bounded pan offsets", () => {
    assert.equal(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
    assert.equal(maxPanOffset(400, 1), 0);
    assert.equal(maxPanOffset(400, 2), 200);
    assert.equal(clampPan(250, 200), 200);
    assert.equal(clampPan(-250, 200), -200);
  });

  it("scales pinch transforms within bounds and resets pan at 1x", () => {
    const zoomIn = applyPinchScale({ scale: 1, x: 0, y: 0 }, 100, 200, 1, 3);
    assert.equal(zoomIn.scale, 2);
    assert.equal(zoomIn.x, 0);

    const zoomOut = applyPinchScale({ scale: 2, x: 12, y: -8 }, 200, 100, 1, 3);
    assert.equal(zoomOut.scale, 1);
    assert.equal(zoomOut.x, 0);
    assert.equal(zoomOut.y, 0);

    const capped = applyPinchScale({ scale: 2.5, x: 0, y: 0 }, 100, 200, 1, 3);
    assert.equal(capped.scale, 3);
  });
});
