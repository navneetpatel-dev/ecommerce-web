import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  QueryObserver,
} from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { giftCardsApi } from "@/features/giftCards";
import { useCheckoutGiftCard } from "../useCheckoutGiftCard.hook";

vi.mock("@/features/giftCards", () => ({
  giftCardsApi: { redeem: vi.fn() },
}));

vi.mock("@/shared/stores/notifications/toast.store", () => ({
  notifySuccess: vi.fn(),
}));

const redeem = vi.mocked(giftCardsApi.redeem);

async function setup(nextCap: number) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // The quote checkout is showing; its refetch returns the server's new cap.
  let cap = 0;
  const quoteFn = vi.fn(async () => ({ maxWalletApplicable: cap }));
  const observer = new QueryObserver(client, {
    queryKey: ["checkout", "quote", {}],
    queryFn: quoteFn,
  });
  const unsubscribe = observer.subscribe(() => undefined);
  await observer.refetch();
  cap = nextCap;

  const onSelect = vi.fn();
  const onWalletAmountChange = vi.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const hook = renderHook(
    () => useCheckoutGiftCard({ onSelect, onWalletAmountChange }),
    { wrapper },
  );
  return { hook, onSelect, onWalletAmountChange, quoteFn, unsubscribe };
}

function typeCode(
  result: { current: ReturnType<typeof useCheckoutGiftCard> },
  value: string,
) {
  act(() => {
    result.current.handleCodeChange({
      target: { value },
    } as ChangeEvent<HTMLInputElement>);
  });
}

async function submit(result: {
  current: ReturnType<typeof useCheckoutGiftCard>;
}) {
  await act(async () => {
    result.current.handleSubmit({
      preventDefault: vi.fn(),
    } as unknown as FormEvent<HTMLFormElement>);
  });
}

describe("useCheckoutGiftCard", () => {
  beforeEach(() => {
    redeem.mockReset();
  });

  it("redeems the card, refetches the quote and applies the server's new wallet cap", async () => {
    redeem.mockResolvedValue({ amount: 500, balance: 500, code: "GIFT1234" });
    const { hook, onSelect, onWalletAmountChange, quoteFn, unsubscribe } =
      await setup(320);

    typeCode(hook.result, "gift1234");
    await submit(hook.result);

    expect(redeem).toHaveBeenCalledWith("gift1234");
    expect(quoteFn).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith("wallet");
    expect(onWalletAmountChange).toHaveBeenCalledWith(320);
    expect(hook.result.current.code).toBe("");
    unsubscribe();
  });

  it("shows the server's error and leaves the payment method alone when redeeming fails", async () => {
    redeem.mockImplementation(async () => {
      throw new Error("boom");
    });
    const { hook, onSelect } = await setup(320);

    typeCode(hook.result, "BADCODE1");
    await submit(hook.result);

    expect(onSelect).not.toHaveBeenCalled();
    expect(hook.result.current.error).toBeTruthy();
    expect(hook.result.current.code).toBe("BADCODE1");
  });

  it("does nothing for an empty code", async () => {
    const { hook } = await setup(0);
    expect(hook.result.current.canApply).toBe(false);
    await submit(hook.result);
    expect(redeem).not.toHaveBeenCalled();
  });
});
