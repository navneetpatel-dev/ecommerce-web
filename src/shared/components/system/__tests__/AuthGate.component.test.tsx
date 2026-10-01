import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useAuthPromptStore } from "@/shared/stores/auth/authPrompt.store";
import { AuthGate } from "../AuthGate.component";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/orders/order-1",
}));

/**
 * The order detail / confirmation routes rely on this component to keep their
 * `useOrder` query off a bearer-less request: the backend requires
 * `authenticate` on `GET /orders/:id`, so an ungated mount produced a 401 whose
 * refresh also failed — which the global `handleSessionExpiry` handler answered
 * with a "session expired" toast for visitors who were never signed in.
 */
describe("AuthGate", () => {
  beforeEach(() => {
    replace.mockReset();
    useAuthPromptStore.setState({
      open: false,
      title: "Sign in to continue",
      message: "",
      redirectTo: null,
    });
    useAuthStore.setState({
      accessToken: null,
      currentUser: null,
      authBootstrapped: false,
    });
  });

  it("renders nothing, and redirects nobody, until the session is known", () => {
    render(
      <AuthGate>
        <span>order body</span>
      </AuthGate>,
    );

    expect(screen.queryByText("order body")).toBeNull();
    expect(replace).not.toHaveBeenCalled();
    expect(useAuthPromptStore.getState().open).toBe(false);
  });

  it("keeps a signed-out visitor away from the gated query and prompts to log in", async () => {
    useAuthStore.setState({ authBootstrapped: true });

    render(
      <AuthGate>
        <span>order body</span>
      </AuthGate>,
    );

    expect(screen.queryByText("order body")).toBeNull();
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(
        PATHS.loginWithRedirect("/orders/order-1"),
      );
    });
    const prompt = useAuthPromptStore.getState();
    expect(prompt.open).toBe(true);
    expect(prompt.redirectTo).toBe("/orders/order-1");
  });

  it("renders the page as soon as the token exists", () => {
    useAuthStore.setState({ accessToken: "token", authBootstrapped: true });

    render(
      <AuthGate>
        <span>order body</span>
      </AuthGate>,
    );

    expect(screen.getByText("order body")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
