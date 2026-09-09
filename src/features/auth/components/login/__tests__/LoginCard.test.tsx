import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginCard } from "../LoginCard.component";
import { LoginSchema, type LoginInput } from "../../../schemas/auth/auth.schema";
import { LABELS } from "@/shared/constants/labels";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

function LoginCardTestHarness() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <LoginCard
      form={form}
      onSubmit={vi.fn()}
      error={null}
      isPending={false}
      oauthRedirect={null}
    />
  );
}

describe("LoginCard - Use email code instead validation", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it("shows error and field error UI when email is empty and email code is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginCardTestHarness />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const useCodeButton = screen.getByRole("button", {
      name: LABELS.useEmailCode,
    });

    expect(emailInput).not.toHaveClass("border-danger");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await user.click(useCodeButton);

    await waitFor(() => {
      expect(screen.getByText(LABELS.emailRequired)).toBeInTheDocument();
    });
    expect(emailInput).toHaveClass("border-danger");
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(document.activeElement).toBe(emailInput);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("updates error to invalid email format if user types an invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginCardTestHarness />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const useCodeButton = screen.getByRole("button", {
      name: LABELS.useEmailCode,
    });

    await user.click(useCodeButton);

    await waitFor(() => {
      expect(screen.getByText(LABELS.emailRequired)).toBeInTheDocument();
    });

    await user.type(emailInput, "not-an-email");

    await waitFor(() => {
      expect(screen.getByText(LABELS.invalidEmail)).toBeInTheDocument();
    });
    expect(emailInput).toHaveClass("border-danger");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("clears error and field UI when a valid email is typed after an error", async () => {
    const user = userEvent.setup();
    render(<LoginCardTestHarness />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const useCodeButton = screen.getByRole("button", {
      name: LABELS.useEmailCode,
    });

    await user.click(useCodeButton);

    await waitFor(() => {
      expect(screen.getByText(LABELS.emailRequired)).toBeInTheDocument();
    });

    await user.type(emailInput, "user@example.com");

    await waitFor(() => {
      expect(screen.queryByText(LABELS.emailRequired)).not.toBeInTheDocument();
      expect(screen.queryByText(LABELS.invalidEmail)).not.toBeInTheDocument();
      expect(emailInput).not.toHaveClass("border-danger");
    });
  });

  it("navigates to OTP page when valid email is entered and email code is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginCardTestHarness />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const useCodeButton = screen.getByRole("button", {
      name: LABELS.useEmailCode,
    });

    await user.type(emailInput, "user@example.com");
    await user.click(useCodeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/otp?email=user%40example.com");
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders forgot password link below input alongside password error", async () => {
    const user = userEvent.setup();
    render(<LoginCardTestHarness />);

    const forgotPasswordLink = screen.getByRole("link", {
      name: LABELS.forgotPassword,
    });
    expect(forgotPasswordLink).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: LABELS.logIn });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(LABELS.passwordRequired)).toBeInTheDocument();
    });

    const passwordInput = document.getElementById("password");
    expect(passwordInput).toHaveClass("border-danger");
  });

  it("clears password error and red border when email code is clicked after login attempt, and restores on login click", async () => {
    const user = userEvent.setup();
    render(<LoginCardTestHarness />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const loginButton = screen.getByRole("button", { name: LABELS.logIn });
    const useCodeButton = screen.getByRole("button", {
      name: LABELS.useEmailCode,
    });

    // 1. Press Login with empty fields -> both show red border and error messages
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(LABELS.emailRequired)).toBeInTheDocument();
      expect(screen.getByText(LABELS.passwordRequired)).toBeInTheDocument();
    });
    expect(emailInput).toHaveClass("border-danger");
    expect(passwordInput).toHaveClass("border-danger");

    // 2. Press Use an email code instead -> password error and red border removed
    await user.click(useCodeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(LABELS.passwordRequired),
      ).not.toBeInTheDocument();
    });
    expect(passwordInput).not.toHaveClass("border-danger");
    expect(emailInput).toHaveClass("border-danger");
    expect(screen.getByText(LABELS.emailRequired)).toBeInTheDocument();

    // 3. Press Login again -> password error and red border restored
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(LABELS.passwordRequired)).toBeInTheDocument();
    });
    expect(passwordInput).toHaveClass("border-danger");
    expect(emailInput).toHaveClass("border-danger");
  });
});
