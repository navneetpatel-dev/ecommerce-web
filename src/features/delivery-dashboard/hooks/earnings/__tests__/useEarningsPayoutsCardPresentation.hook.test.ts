import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEarningsPayoutsCardPresentation } from "../useEarningsPayoutsCardPresentation.hook";

vi.mock("../../../api/agent/deliveryAgent.api", () => ({
  deliveryAgentApi: {
    downloadPayoutStatement: vi.fn(),
  },
}));

vi.mock("../../../api/agent/deliveryAgent.queries", () => ({
  useMyEarningsLedger: vi.fn(),
  useMyPayouts: vi.fn(),
  useShiftSummary: vi.fn(),
}));

import {
  useMyEarningsLedger,
  useMyPayouts,
  useShiftSummary,
} from "../../../api/agent/deliveryAgent.queries";

describe("useEarningsPayoutsCardPresentation", () => {
  beforeEach(() => {
    vi.mocked(useMyEarningsLedger).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useMyEarningsLedger>);
    vi.mocked(useMyPayouts).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useMyPayouts>);
  });

  it("passes useShiftSummary pendingEarnings and pendingEarningsCount through unchanged", () => {
    vi.mocked(useShiftSummary).mockReturnValue({
      data: { pendingEarnings: 123.45, pendingEarningsCount: 3 },
      isLoading: false,
    } as unknown as ReturnType<typeof useShiftSummary>);

    const { result } = renderHook(() => useEarningsPayoutsCardPresentation());

    expect(result.current.pendingTotal).toBe(123.45);
    expect(result.current.pendingCount).toBe(3);
    expect(result.current.pendingLoading).toBe(false);
    expect(result.current.pendingSummaryLabel).toBe(
      "₹123.45 pending across 3 completed tasks — included in the next payout run.",
    );
  });

  it("uses the singular task noun when pendingEarningsCount is 1", () => {
    vi.mocked(useShiftSummary).mockReturnValue({
      data: { pendingEarnings: 50, pendingEarningsCount: 1 },
      isLoading: false,
    } as unknown as ReturnType<typeof useShiftSummary>);

    const { result } = renderHook(() => useEarningsPayoutsCardPresentation());

    expect(result.current.pendingSummaryLabel).toBe(
      "₹50.00 pending across 1 completed task — included in the next payout run.",
    );
  });

  it("defaults pending figures to zero when shift summary has not loaded", () => {
    vi.mocked(useShiftSummary).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useShiftSummary>);

    const { result } = renderHook(() => useEarningsPayoutsCardPresentation());

    expect(result.current.pendingTotal).toBe(0);
    expect(result.current.pendingCount).toBe(0);
    expect(result.current.pendingLoading).toBe(true);
    expect(result.current.pendingSummaryLabel).toBe("Loading pending earnings...");
  });
});
