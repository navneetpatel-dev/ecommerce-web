import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { useAuthPromptStore } from "@/shared/stores/auth/authPrompt.store";
import { LoginRequiredDialogContainer } from "../LoginRequiredDialogContainer.container";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: push }),
}));
vi.mock("@/shared/utils/navigation/navigate", () => ({
  navigate: (_r: unknown, to: string) => push(to),
}));

describe("sign-in prompt (B-08, C-06)", () => {
  it("puts focus back on the heart when closed with Escape", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Add to wishlist</button>
        <LoginRequiredDialogContainer />
      </>,
    );
    const heart = screen.getByRole("button", { name: "Add to wishlist" });
    heart.focus();
    act(() =>
      useAuthPromptStore.getState().openPrompt({ message: "Sign in to save" }),
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(heart).toHaveFocus();
  });

  it("offers Create account, keeping the page to return to", async () => {
    const user = userEvent.setup();
    render(<LoginRequiredDialogContainer />);
    act(() =>
      useAuthPromptStore
        .getState()
        .openPrompt({ message: "Sign in", redirectTo: "/products/tee" }),
    );
    await user.click(
      await screen.findByRole("button", { name: LABELS.createAccount }),
    );
    expect(push).toHaveBeenCalledWith("/register?redirect=%2Fproducts%2Ftee");
  });
});
