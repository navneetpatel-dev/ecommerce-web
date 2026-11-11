import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VendorLogo } from "../VendorLogo.component";

describe("VendorLogo (B-21)", () => {
  it("swaps a failed logo for the shop's initial", () => {
    const { container } = render(
      <VendorLogo
        logoUrl="https://cdn.example.com/logo.png"
        businessName="Kalash"
      />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    fireEvent.error(img!);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("shows the initial when there is no logo", () => {
    render(<VendorLogo logoUrl={null} businessName="Aurelia" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
