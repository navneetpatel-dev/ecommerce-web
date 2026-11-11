import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { ResetPasswordCard } from "../ResetPasswordCard.component";

function Harness(props: {
  hasToken: boolean;
  linkInvalid: boolean;
  error: string | null;
}) {
  const form = useForm({
    defaultValues: { token: props.hasToken ? "t" : "", newPassword: "" },
  });
  return (
    <ResetPasswordCard
      form={form}
      onSubmit={vi.fn()}
      isPending={false}
      {...props}
    />
  );
}

describe("ResetPasswordCard (B-04)", () => {
  it("explains a page opened without the link, with a way to a new one", () => {
    render(<Harness hasToken={false} linkInvalid={false} error={null} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      LABELS.resetLinkMissing,
    );
    expect(
      screen.getByRole("link", { name: LABELS.requestNewResetLink }),
    ).toHaveAttribute("href", PATHS.forgotPassword);
    expect(
      screen.queryByRole("button", { name: LABELS.resetPassword }),
    ).not.toBeInTheDocument();
  });

  it("says the link no longer works when the API refuses it", () => {
    render(<Harness hasToken linkInvalid error={LABELS.resetLinkInvalid} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      LABELS.resetLinkInvalid,
    );
    expect(
      screen.getByRole("link", { name: LABELS.requestNewResetLink }),
    ).toBeInTheDocument();
  });

  it("shows the form for a fresh link", () => {
    render(<Harness hasToken linkInvalid={false} error={null} />);
    expect(
      screen.getByRole("button", { name: LABELS.resetPassword }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
