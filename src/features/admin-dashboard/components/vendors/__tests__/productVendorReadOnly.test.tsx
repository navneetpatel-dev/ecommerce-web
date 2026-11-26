import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LABELS } from "@/shared/constants/labels";
import { ProductVendorReadOnly } from "../ProductVendorReadOnly.component";

describe("whose product this is, while editing", () => {
  it("shows the vendor's name", () => {
    render(<ProductVendorReadOnly vendorName="Acme Traders" />);
    expect(screen.getByText("Acme Traders")).toBeInTheDocument();
    expect(screen.queryByText(LABELS.listedByPlatform)).toBeNull();
  });

  it("a platform product says so", () => {
    render(<ProductVendorReadOnly vendorName={null} />);
    expect(screen.getByText(LABELS.platformProductName)).toBeInTheDocument();
  });

  it("marks a listing the platform prepared for the vendor", () => {
    render(
      <ProductVendorReadOnly vendorName="Acme Traders" listedByPlatform />,
    );
    expect(screen.getByText(LABELS.listedByPlatform)).toBeInTheDocument();
  });
});
