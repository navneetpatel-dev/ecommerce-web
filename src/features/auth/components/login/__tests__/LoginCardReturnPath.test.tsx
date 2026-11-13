import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginCard } from "../LoginCard.component";
import {
  LoginSchema,
  type LoginInput,
} from "../../../schemas/auth/auth.schema";
import { LABELS } from "@/shared/constants/labels";

let mockSearch = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(mockSearch),
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

describe("LoginCard - coming back from a gated page", () => {
  beforeEach(() => {
    mockSearch = "";
  });

  it("explains the detour and keeps the way back on the Register link", () => {
    mockSearch = "redirect=%2Fwallet%3Ftab%3Dhistory";
    render(<LoginCardTestHarness />);
    expect(screen.getByText(LABELS.loginToContinueNotice)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: LABELS.register })).toHaveAttribute(
      "href",
      "/register?redirect=%2Fwallet%3Ftab%3Dhistory",
    );
  });

  it("ignores an off-site redirect", () => {
    mockSearch = "redirect=%2F%2Fevil.example";
    render(<LoginCardTestHarness />);
    expect(screen.queryByText(LABELS.loginToContinueNotice)).toBeNull();
    expect(screen.getByRole("link", { name: LABELS.register })).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
