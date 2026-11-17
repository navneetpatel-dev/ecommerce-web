import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { settingsKeys } from "@/shared/hooks/usePublicSettings.hook";
import { settingsApi } from "../../../api/settings/settings.api";
import { usePlatformSettingsForm } from "../usePlatformSettingsForm.hook";

vi.mock("../../../api/settings/settings.api", () => ({
  settingsApi: { get: vi.fn(), update: vi.fn() },
}));

const stored = {
  defaultCommissionRate: 10,
  payoutCycle: "weekly",
  defaultReturnWindow: 7,
  freeShippingThreshold: 500,
  supportEmail: "s@x.com",
  supportHours: "9-5",
  ticketReopenWindowDays: 7,
  bugVerifyWindowDays: 7,
  bugCloseWindowDays: 7,
  autoApproveProducts: false,
};

function setup() {
  const queryClient = new QueryClient();
  const invalidate = vi.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return {
    invalidate,
    ...renderHook(() => usePlatformSettingsForm(), { wrapper }),
  };
}

describe("usePlatformSettingsForm", () => {
  beforeEach(() => {
    vi.mocked(settingsApi.get).mockResolvedValue(stored as never);
    vi.mocked(settingsApi.update).mockReset();
  });

  it("upper-cases a legacy payout cycle so it passes the API's enum", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.form).not.toBeNull());
    expect(result.current.form?.payoutCycle).toBe("WEEKLY");
  });

  it("defaults the review and question auto-approve switches to on", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.form).not.toBeNull());
    expect(result.current.form?.autoApproveReviews).toBe(true);
    expect(result.current.form?.autoApproveQuestions).toBe(true);
  });

  it("ignores a second save while one is in flight, then refreshes storefront settings", async () => {
    let finish: (value: unknown) => void = () => undefined;
    vi.mocked(settingsApi.update).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }) as never,
    );
    const { result, invalidate } = setup();
    await waitFor(() => expect(result.current.form).not.toBeNull());

    act(() => result.current.save());
    act(() => result.current.save());
    expect(settingsApi.update).toHaveBeenCalledTimes(1);
    expect(result.current.saving).toBe(true);

    await act(async () => finish({ ...stored, payoutCycle: "WEEKLY" }));

    expect(result.current.saving).toBe(false);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: settingsKeys.public });
  });

  it("re-enables saving and reports an error when a save fails", async () => {
    vi.mocked(settingsApi.update).mockRejectedValue(new Error("boom"));
    const { result } = setup();
    await waitFor(() => expect(result.current.form).not.toBeNull());

    await act(async () => result.current.save());

    expect(result.current.saving).toBe(false);
    expect(result.current.saveError).toBeTruthy();
  });
});
