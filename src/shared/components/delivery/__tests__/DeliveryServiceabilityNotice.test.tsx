import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  isDeliveryAreaBlocked,
  UNKNOWN_DELIVERY_AREA,
} from "@/shared/utils/delivery/deliveryArea";
import { DeliveryServiceabilityNotice } from "../DeliveryServiceabilityNotice.component";

/**
 * The notice is the funnels' shared voice for the delivery area, and the one rule it must
 * never break is that an unanswered check stays quiet — a flaky network must not tell a
 * customer we can't deliver somewhere we can.
 */
describe("DeliveryServiceabilityNotice", () => {
  it("warns that some items can't reach the area", () => {
    render(
      <DeliveryServiceabilityNotice
        pincode="560001"
        status={{ ...UNKNOWN_DELIVERY_AREA.status, known: true }}
      />,
    );

    expect(
      screen.getByText(/can’t be delivered to 560001/),
    ).toBeInTheDocument();
  });

  it("promises the area, with the delivery window", () => {
    render(
      <DeliveryServiceabilityNotice
        pincode="560001"
        status={{
          ...UNKNOWN_DELIVERY_AREA.status,
          known: true,
          serviceable: true,
          estimatedDays: { min: 2, max: 5 },
          freeShippingThreshold: 499,
        }}
      />,
    );

    expect(screen.getByText(/2–5 days/)).toBeInTheDocument();
    expect(screen.getByText(/499/)).toBeInTheDocument();
  });

  it("says it is checking while the answer is on its way", () => {
    render(
      <DeliveryServiceabilityNotice
        pincode="560001"
        status={UNKNOWN_DELIVERY_AREA.status}
        isChecking
      />,
    );

    expect(screen.getByText(/Checking delivery to 560001/)).toBeInTheDocument();
  });

  it("renders nothing without an area, or when a failed check left no answer", () => {
    const { container, rerender } = render(
      <DeliveryServiceabilityNotice
        pincode={null}
        status={UNKNOWN_DELIVERY_AREA.status}
      />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(
      <DeliveryServiceabilityNotice
        pincode="560001"
        status={UNKNOWN_DELIVERY_AREA.status}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("agrees with the gate on what blocks a step", () => {
    expect(
      isDeliveryAreaBlocked({
        pincode: "560001",
        status: { ...UNKNOWN_DELIVERY_AREA.status, known: true },
        isChecking: false,
      }),
    ).toBe(true);
  });
});
