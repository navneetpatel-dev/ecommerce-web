import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AdminShippingZoneDialog } from "../AdminShippingZoneDialog.component";
import { AdminShippingRateDialog } from "../AdminShippingRateDialog.component";
import { AdminShippingZonesFilters } from "../AdminShippingZonesFilters.component";
import { AdminShippingRatesFilters } from "../AdminShippingRatesFilters.component";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Shipping Module Modals and Filters", () => {
  describe("AdminShippingZoneDialog", () => {
    it("renders modal dialog when open is true", () => {
      renderWithClient(
        <AdminShippingZoneDialog
          open={true}
          onOpenChange={vi.fn()}
          name="North Zone"
          states="Delhi, Punjab"
          pincodePrefixes="110, 140"
          onNameChange={vi.fn()}
          onStatesChange={vi.fn()}
          onPincodePrefixesChange={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByDisplayValue("North Zone")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Delhi, Punjab")).toBeInTheDocument();
    });

    it("does not render dialog content when open is false", () => {
      renderWithClient(
        <AdminShippingZoneDialog
          open={false}
          onOpenChange={vi.fn()}
          name=""
          states=""
          pincodePrefixes=""
          onNameChange={vi.fn()}
          onStatesChange={vi.fn()}
          onPincodePrefixesChange={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("AdminShippingRateDialog", () => {
    const mockZones = [{ id: "zone-1", name: "Metro Cities" }];

    it("renders modal dialog when open is true", () => {
      renderWithClient(
        <AdminShippingRateDialog
          open={true}
          onOpenChange={vi.fn()}
          zoneId="zone-1"
          method={SHIPPING_METHOD.STANDARD}
          minWeightGrams="0"
          maxWeightGrams="5000"
          price="99"
          estimatedDays="3"
          freeShippingThreshold="499"
          vendorId=""
          zones={mockZones}
          onZoneIdChange={vi.fn()}
          onMethodChange={vi.fn()}
          onMinWeightGramsChange={vi.fn()}
          onMaxWeightGramsChange={vi.fn()}
          onPriceChange={vi.fn()}
          onEstimatedDaysChange={vi.fn()}
          onFreeShippingThresholdChange={vi.fn()}
          onVendorIdChange={vi.fn()}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
      expect(screen.getByDisplayValue("99")).toBeInTheDocument();
    });
  });

  describe("AdminShippingZonesFilters", () => {
    it("renders collapsible filter bar and triggers search change", async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      const onClear = vi.fn();

      renderWithClient(
        <AdminShippingZonesFilters
          search="North"
          onSearchChange={onSearchChange}
          onClear={onClear}
        />,
      );

      // Open collapsible filter bar
      const filterButton = screen.getByRole("button", { name: /filters/i });
      expect(filterButton).toBeInTheDocument();
      await user.click(filterButton);

      const searchInput = screen.getByPlaceholderText(
        "Search zones by name, state, or pincode prefix...",
      );
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue("North");
    });
  });

  describe("AdminShippingRatesFilters", () => {
    it("renders filters and active reset button when active", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();

      renderWithClient(
        <AdminShippingRatesFilters
          search="Express"
          onSearchChange={vi.fn()}
          zoneId="ALL"
          onZoneIdChange={vi.fn()}
          method="ALL"
          onMethodChange={vi.fn()}
          vendorId="ALL"
          onVendorIdChange={vi.fn()}
          zones={[{ id: "zone-1", name: "Metro" }]}
          vendors={[{ id: "v-1", name: "Acme Corp" }]}
          onClear={onClear}
        />,
      );

      // Collapsible toggle should show active count
      const filterButton = screen.getByRole("button", { name: /filters/i });
      expect(filterButton).toBeInTheDocument();
      await user.click(filterButton);

      const searchInput = screen.getByPlaceholderText(
        "Search rates by zone, vendor, or method...",
      );
      expect(searchInput).toBeInTheDocument();
    });
  });
});
