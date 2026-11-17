import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newsletterApi } from "@/shared/api/newsletter.api";
import { useNewsletterConfirmPage } from "../useNewsletterConfirmPage.hook";

let query = "token=abc123";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(query),
}));
vi.mock("@/shared/api/newsletter.api", () => ({
  newsletterApi: { confirm: vi.fn() },
}));

function setup() {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
  return renderHook(() => useNewsletterConfirmPage(), { wrapper });
}

describe("useNewsletterConfirmPage", () => {
  beforeEach(() => {
    query = "token=abc123";
    vi.mocked(newsletterApi.confirm).mockReset();
  });

  it("does nothing until the button is pressed (a mail scanner opening the link confirms nobody)", () => {
    setup();
    expect(newsletterApi.confirm).not.toHaveBeenCalled();
  });

  it("confirms with the link's token", async () => {
    vi.mocked(newsletterApi.confirm).mockResolvedValue({ confirmed: true });
    const { result } = setup();

    act(() => result.current.handleConfirm());

    await waitFor(() => expect(result.current.isDone).toBe(true));
    expect(newsletterApi.confirm).toHaveBeenCalledWith("abc123");
  });

  it("flags a link with no token and surfaces a failed confirmation", async () => {
    query = "";
    expect(setup().result.current.hasToken).toBe(false);

    query = "token=abc123";
    vi.mocked(newsletterApi.confirm).mockRejectedValue(new Error("expired"));
    const { result } = setup();
    act(() => result.current.handleConfirm());
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
