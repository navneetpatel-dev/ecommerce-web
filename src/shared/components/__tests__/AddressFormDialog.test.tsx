import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddressFormDialog } from "../AddressFormDialog.component";

describe("AddressFormDialog", () => {
  it("opens without repeatedly resetting manual form errors", () => {
    render(
      <AddressFormDialog
        open
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        hasAddresses={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "New address" }),
    ).toBeInTheDocument();
  });
});
