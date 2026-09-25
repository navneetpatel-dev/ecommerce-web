import { describe, it } from "vitest";
import assert from "node:assert/strict";
import type { ReturnRequest } from "@/shared/api/types";
import { buildRefundBreakdownLines } from "../refundBreakdown";

function row(overrides: Partial<ReturnRequest>): ReturnRequest {
  return {
    id: "rr-1",
    subOrderId: "so-1",
    orderItemId: "oi-1",
    userId: "u-1",
    reason: "Changed mind",
    reasonCode: "NO_LONGER_NEEDED",
    status: "APPROVED",
    refundAmount: 68,
    resolvedAt: null,
    createdAt: "2026-09-25T00:00:00.000Z",
    productName: "Item",
    ...overrides,
  } as ReturnRequest;
}

describe("buildRefundBreakdownLines", () => {
  it("shows the backend's merchandise, tax and fee figures", () => {
    const { compositionLines } = buildRefundBreakdownLines(
      row({
        refundAmount: 68,
        refundMerchandiseAmount: 100,
        refundTaxAmount: 18,
        returnShippingFeeAmount: 50,
      }),
    );

    assert.deepEqual(
      compositionLines.map((line) => [line.amount, Boolean(line.isDeduction)]),
      [
        [100, false],
        [18, false],
        [50, true],
      ],
    );
  });

  it("keeps the real merchandise figure when the fee exceeded the refund", () => {
    // Backing merchandise out of a refund clamped to 0 used to show 0 − 18 + 150 = 132.
    const { compositionLines } = buildRefundBreakdownLines(
      row({
        refundAmount: 0,
        refundMerchandiseAmount: 100,
        refundTaxAmount: 18,
        returnShippingFeeAmount: 150,
      }),
    );

    assert.equal(compositionLines[0]?.amount, 100);
  });
});
