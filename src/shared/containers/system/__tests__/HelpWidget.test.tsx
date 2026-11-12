import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { ChatWidgetContainer } from "../ChatWidgetContainer.container";

vi.mock("@/shared/hooks/usePublicSettings.hook", () => ({
  usePublicSettings: () => ({ data: { supportHours: "Mon–Sat, 9am–7pm" } }),
}));

describe("Help widget (B-10)", () => {
  it("offers real ways to get help instead of a chat that does not exist", async () => {
    const user = userEvent.setup();
    render(<ChatWidgetContainer />);
    await user.click(
      screen.getByRole("button", { name: LABELS.openChatSupport }),
    );
    expect(
      screen.getByRole("link", { name: LABELS.helpRaiseTicket }),
    ).toHaveAttribute("href", PATHS.supportTicketNew);
    expect(
      screen.getByRole("link", { name: LABELS.helpContactUs }),
    ).toHaveAttribute("href", PATHS.contact);
    expect(screen.getByText(/Mon–Sat, 9am–7pm/)).toBeInTheDocument();
    expect(
      screen.queryByText(/chat support is available/i),
    ).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the bubble", async () => {
    const user = userEvent.setup();
    render(<ChatWidgetContainer />);
    const bubble = screen.getByRole("button", { name: LABELS.openChatSupport });
    await user.click(bubble);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(bubble).toHaveFocus();
  });
});
