import { describe, expect, it } from "vitest";
import type { Order } from "@/shared/api/types";
import { canCancelOrder } from "../orderCancel.utils";

function order(fields: Partial<Order>): Order {
  return {
    status: "CONFIRMED",
    paymentStatus: "PAID",
    paymentMethod: "RAZORPAY",
    subOrders: [{ status: "CONFIRMED" }],
    ...fields,
  } as Order;
}

describe("canCancelOrder", () => {
  it("lets a COD customer cancel before anything ships, though nothing is paid yet", () => {
    expect(
      canCancelOrder(order({ paymentMethod: "COD", paymentStatus: "PENDING" })),
    ).toBe(true);
  });

  it("still hides cancel on an unpaid online order (an abandoned checkout)", () => {
    expect(canCancelOrder(order({ paymentStatus: "PENDING" }))).toBe(false);
  });

  it("hides cancel once a part has shipped", () => {
    expect(
      canCancelOrder(
        order({
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          subOrders: [
            { status: "CONFIRMED" },
            { status: "SHIPPED" },
          ] as Order["subOrders"],
        }),
      ),
    ).toBe(false);
  });

  it("still offers cancel for the rest once one part was cancelled", () => {
    expect(
      canCancelOrder(
        order({
          subOrders: [
            { status: "CANCELLED" },
            { status: "CONFIRMED" },
          ] as Order["subOrders"],
        }),
      ),
    ).toBe(true);
  });
});
