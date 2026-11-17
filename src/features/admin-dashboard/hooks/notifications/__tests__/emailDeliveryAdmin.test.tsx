import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notificationsApi } from "../../../api/notifications/notifications.api";
import { useEmailHealth } from "../useEmailHealth.hook";
import { useResendNotification } from "../useResendNotification.hook";

vi.mock("../../../api/notifications/notifications.api", () => ({
  notificationsApi: { health: vi.fn(), resend: vi.fn() },
}));

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe("useEmailHealth", () => {
  beforeEach(() => {
    vi.mocked(notificationsApi.health).mockReset();
  });

  it("labels a healthy system and hides the failure line", async () => {
    vi.mocked(notificationsApi.health).mockResolvedValue({
      status: "OK",
      headline: "Email delivery is healthy.",
      windowMinutes: 30,
      sent: 12,
      failed: 0,
      stuck: 0,
      failuresByCategory: {},
      lastSentAt: null,
      lastFailure: null,
    });
    const { result } = renderHook(() => useEmailHealth(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.status).toBe("OK"));
    expect(result.current.stats).toContain("12 sent");
    expect(result.current.lastFailure).toBeNull();
  });

  it("shows what is wrong when delivery is down", async () => {
    vi.mocked(notificationsApi.health).mockResolvedValue({
      status: "DOWN",
      headline: "Emails are failing.",
      windowMinutes: 30,
      sent: 0,
      failed: 6,
      stuck: 3,
      failuresByCategory: { CONFIG: 6 },
      lastSentAt: null,
      lastFailure: {
        category: "CONFIG",
        error: "Username and Password not accepted",
        at: "2026-11-18T10:00:00Z",
      },
    });
    const { result } = renderHook(() => useEmailHealth(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.status).toBe("DOWN"));
    expect(result.current.lastFailure).toContain(
      "Username and Password not accepted",
    );
  });

  it("reports when the check itself fails", async () => {
    vi.mocked(notificationsApi.health).mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useEmailHealth(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.loadError).toBeTruthy());
  });
});

describe("useResendNotification", () => {
  beforeEach(() => {
    vi.mocked(notificationsApi.resend).mockReset();
  });

  it("re-queues the email, confirms, and reloads the list", async () => {
    vi.mocked(notificationsApi.resend).mockResolvedValue({
      id: "l1",
      status: "PENDING",
    });
    const onDone = vi.fn();
    const { result } = renderHook(() => useResendNotification(onDone), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.resend("l1"));

    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(notificationsApi.resend).toHaveBeenCalledWith("l1");
    expect(result.current.notice).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  it("shows why a resend was refused and does not reload", async () => {
    vi.mocked(notificationsApi.resend).mockRejectedValue(new Error("nope"));
    const onDone = vi.fn();
    const { result } = renderHook(() => useResendNotification(onDone), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.resend("l1"));

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(onDone).not.toHaveBeenCalled();
  });
});
