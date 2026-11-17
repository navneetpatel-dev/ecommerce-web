import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandPalette } from "../CommandPalette.component";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/shared/hooks/theme/useThemePalette.hook", () => ({
  useThemePalette: () => ({
    mode: "light",
    toggleMode: vi.fn(),
    mounted: true,
  }),
}));

describe("CommandPalette", () => {
  it("opens when Cmd+K is pressed", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    expect(
      screen.queryByRole("dialog", { name: "Command palette" }),
    ).not.toBeInTheDocument();

    await user.keyboard("{Meta>}k{/Meta}");
    expect(
      screen.getByRole("dialog", { name: "Command palette" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type a command or search..."),
    ).toBeInTheDocument();
  });

  it("filters commands based on search input", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    await user.keyboard("{Meta>}k{/Meta}");

    const input = screen.getByPlaceholderText("Type a command or search...");
    await user.type(input, "shipping");

    expect(screen.getByText("Shipping & RTO Operations")).toBeInTheDocument();
    expect(screen.queryByText("Coupons & Discounts")).not.toBeInTheDocument();
  });

  it("executes command and navigates when Enter is pressed", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    await user.keyboard("{Meta>}k{/Meta}");

    const input = screen.getByPlaceholderText("Type a command or search...");
    await user.type(input, "Orders");
    await user.keyboard("{Enter}");

    expect(mockPush).toHaveBeenCalledWith("/admin/orders");
    expect(
      screen.queryByRole("dialog", { name: "Command palette" }),
    ).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<CommandPalette />);

    await user.keyboard("{Meta>}k{/Meta}");
    expect(
      screen.getByRole("dialog", { name: "Command palette" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Command palette" }),
    ).not.toBeInTheDocument();
  });
});
