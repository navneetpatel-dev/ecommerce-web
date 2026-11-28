import { describe, it } from "vitest";
import assert from "node:assert/strict";
import type { ReturnRequest } from "@/shared/api/types";
import { buildRefundBreakdownLines } from "../refundBreakdown";
import {
  returnPendingRefundDetail,
  returnRefundNotes,
} from "../returnRefundStatus";

const row = (overrides: Partial<ReturnRequest>): ReturnRequest =>
  ({
    id: "rr-1",
    orderItemId: "oi-1",
    reason: "x",
    reasonCode: "DAMAGED",
    status: "RECEIVED",
    refundAmount: 0,
    resolvedAt: null,
    createdAt: "2026-11-08T00:00:00.000Z",
    ...overrides,
  }) as ReturnRequest;

/** What the lines add up to: credits less deductions. */
const total = (r: ReturnRequest) =>
  buildRefundBreakdownLines(r).compositionLines.reduce(
    (sum, line) => sum + (line.isDeduction ? -line.amount : line.amount),
    0,
  );

describe("U19: the return card's lines add up to the refund", () => {
  it("Tiered: ₹800 + ₹144 less ₹177 for the offer = ₹767", () => {
    const r = row({
      refundAmount: 767,
      refundMerchandiseAmount: 800,
      refundTaxAmount: 144,
      offerAdjustment: 177,
    });
    assert.equal(Math.round(total(r) * 100) / 100, 767);
  });

  it("BOGO: ₹500 + ₹90 less ₹590 = ₹0", () => {
    const r = row({
      refundAmount: 0,
      refundMerchandiseAmount: 500,
      refundTaxAmount: 90,
      offerAdjustment: 590,
    });
    assert.equal(total(r), 0);
  });

  it("Bundle: ₹471.27 + ₹56.55 less ₹67.82 = ₹460.00", () => {
    const r = row({
      refundAmount: 460,
      refundMerchandiseAmount: 471.27,
      refundTaxAmount: 56.55,
      offerAdjustment: 67.82,
    });
    assert.equal(Math.round(total(r) * 100) / 100, 460);
  });
});

describe("U20 + U21: why the refund is smaller, in every state", () => {
  it("names the held-back offer and the cashback taken back", () => {
    const notes = returnRefundNotes(
      row({ offerAdjustment: 177, cashbackClawback: 75 }),
    );
    assert.equal(notes.length, 2);
    assert.match(notes[0]!, /177\.00 less/);
    assert.match(notes[1]!, /75\.00 cashback/);
  });

  it("a refund not started yet shows its amount", () => {
    assert.match(
      returnPendingRefundDetail(row({ refundAmount: 767 })),
      /767\.00/,
    );
  });
});
