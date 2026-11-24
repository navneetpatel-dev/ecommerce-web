import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  isProductRecord,
  ProductRecordDetailView,
} from "../ProductRecordDetailView.component";

describe("ProductRecordDetailView", () => {
  const sampleProduct = {
    id: "prod-1",
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    brand: "Artisan Clay",
    categoryName: "Kitchenware",
    basePrice: 499,
    displayPrice: 549,
    compareAtPrice: 799,
    discountPercent: 31,
    stock: 25,
    status: "ACTIVE",
    avgRating: 4.8,
    reviewCount: 15,
    description: "Handcrafted ceramic mug with ergonomic handle.",
    highlights: ["Microwave safe", "Lead-free glaze"],
    tags: ["ceramic", "coffee", "handmade"],
    imageUrl: "https://example.com/mug.jpg",
    images: [
      { id: "img-1", url: "https://example.com/mug-1.jpg", isPrimary: true },
      { id: "img-2", url: "https://example.com/mug-2.jpg" },
    ],
    variants: [
      {
        id: "var-1",
        sku: "MUG-BLU",
        price: 549,
        stock: 15,
        lowStockAt: 3,
        attributes: { Color: "Blue" },
      },
    ],
    specs: {
      Material: "Ceramic",
      Capacity: "350ml",
    },
    hsnCode: "691200",
    gstPercentage: 18,
    returnsAllowed: true,
    returnWindowDays: 7,
    vendor: {
      id: "v-123",
      businessName: "Clay Crafts Ltd",
      slug: "clay-crafts",
      email: "contact@claycrafts.com",
      phone: "+91 98765 43210",
      commissionRate: 12,
      gstNumber: "27AAAAA0000A1Z5",
    },
    rejectionReason: "Images require higher resolution backdrop.",
  };

  it("correctly identifies product records", () => {
    expect(isProductRecord(sampleProduct)).toBe(true);
    expect(isProductRecord({ name: "Simple item", basePrice: 100 })).toBe(true);
    expect(isProductRecord({ name: "User Profile", email: "a@b.com" })).toBe(
      false,
    );
  });

  it("renders all product cards with rich formatting", () => {
    render(<ProductRecordDetailView product={sampleProduct} />);

    // Hero card
    expect(screen.getByText("Ceramic Coffee Mug")).toBeInTheDocument();
    expect(screen.getByText("Artisan Clay")).toBeInTheDocument();
    expect(screen.getAllByText("Kitchenware").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("31% OFF")).toBeInTheDocument();
    expect(screen.getByText("25 in stock")).toBeInTheDocument();

    // Gallery card
    expect(screen.getByText("Product Gallery")).toBeInTheDocument();
    expect(screen.getByText(/3 photos/i)).toBeInTheDocument();

    // Story and Highlights card
    expect(
      screen.getByText("Handcrafted ceramic mug with ergonomic handle."),
    ).toBeInTheDocument();
    expect(screen.getByText("Microwave safe")).toBeInTheDocument();
    expect(screen.getByText("ceramic")).toBeInTheDocument();

    // Variants card
    expect(screen.getByText("MUG-BLU")).toBeInTheDocument();
    expect(screen.getByText("Color:")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();

    // Specs card
    expect(screen.getByText("Material")).toBeInTheDocument();
    expect(screen.getByText("350ml")).toBeInTheDocument();

    // Policies card
    expect(screen.getByText("691200")).toBeInTheDocument();
    expect(screen.getByText("18%")).toBeInTheDocument();
    expect(screen.getByText(/7 Days Window/i)).toBeInTheDocument();

    // Vendor card
    expect(screen.getByText("Clay Crafts Ltd")).toBeInTheDocument();
    expect(screen.getByText("@clay-crafts")).toBeInTheDocument();
    expect(screen.getByText("contact@claycrafts.com")).toBeInTheDocument();
    expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
    expect(screen.getByText("27AAAAA0000A1Z5")).toBeInTheDocument();

    // Rejection / Moderation card
    expect(
      screen.getByText(/Images require higher resolution backdrop/i),
    ).toBeInTheDocument();
  });

  it("gracefully handles minimal product records without crashing", () => {
    const minimal = {
      name: "Minimal Product",
      basePrice: 100,
    };
    render(<ProductRecordDetailView product={minimal} />);
    expect(screen.getByText("Minimal Product")).toBeInTheDocument();
  });
});
