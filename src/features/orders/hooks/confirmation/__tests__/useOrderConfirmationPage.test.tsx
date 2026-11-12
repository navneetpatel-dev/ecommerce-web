import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { cartKeys } from "@/features/cart";
import { useOrderConfirmationPage } from "../useOrderConfirmationPage.hook";

vi.mock("next/navigation", () => ({ useParams: () => ({ orderId: "o1" }) }));

/** The header cart badge must not keep the pre-order count on the confirmation page. */
describe("useOrderConfirmationPage", () => {
  it("refetches the cart once checkout has left the screen", () => {
    const client = new QueryClient();
    const spy = vi.spyOn(client, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useOrderConfirmationPage(), {
      wrapper,
    });
    expect(result.current.orderId).toBe("o1");
    expect(spy).toHaveBeenCalledWith({ queryKey: cartKeys.all });
  });
});
