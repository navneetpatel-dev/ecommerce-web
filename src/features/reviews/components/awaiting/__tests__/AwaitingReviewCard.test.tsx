import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AwaitingReviewCard } from "../AwaitingReviewCard.component";

describe("AwaitingReviewCard", () => {
  it("opens the product with the Reviews tab and this delivered line's review box", () => {
    render(
      <ul>
        <AwaitingReviewCard
          item={{
            productId: "p-1",
            productName: "Yoga Pro 466",
            productSlug: "product-466-yoga",
            imageUrl: null,
            orderItemId: "oi-9",
            orderId: "o-1",
            deliveredAt: "2026-11-10T00:00:00Z",
          }}
        />
      </ul>,
    );
    expect(
      screen.getByRole("link", { name: /Write a review/ }),
    ).toHaveAttribute(
      "href",
      "/products/product-466-yoga?tab=reviews&review=oi-9",
    );
  });
});
