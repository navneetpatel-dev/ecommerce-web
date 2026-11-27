import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusDialog } from "../StatusDialog.component";
import type { StatusDialogVariant } from "../StatusDialog.component";

const noop = vi.fn();

function renderDialog(variant: StatusDialogVariant = "danger") {
  const handlers = { onOpenChange: vi.fn(), confirm: vi.fn(), cancel: vi.fn() };
  render(
    <StatusDialog
      open
      onOpenChange={handlers.onOpenChange}
      variant={variant}
      title="Delete this tax rule?"
      description="Accessories will use its parent's rate."
      secondaryAction={{ label: "Cancel", onClick: handlers.cancel }}
      primaryAction={{ label: "Delete", onClick: handlers.confirm }}
    />,
  );
  return handlers;
}

const buttonNames = () =>
  screen
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-label") ?? button.textContent);

describe("StatusDialog", () => {
  it("is named and described by its title and text", () => {
    renderDialog();

    const dialog = screen.getByRole("dialog", {
      name: "Delete this tax rule?",
    });
    expect(dialog).toHaveAccessibleDescription(
      "Accessories will use its parent's rate.",
    );
  });

  it("runs the two actions and closes from the ✕", async () => {
    const user = userEvent.setup();
    const handlers = renderDialog();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(handlers.confirm).toHaveBeenCalledOnce();
    expect(handlers.cancel).toHaveBeenCalledOnce();
    expect(handlers.onOpenChange).toHaveBeenCalledWith(false);
  });

  it.each([
    ["danger", "bg-danger"],
    ["warning", "bg-warning"],
    ["success", "bg-success"],
    ["info", "bg-ink"],
  ] as const)("colours the %s confirm button", (variant, colour) => {
    renderDialog(variant);

    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass(colour);
    expect(
      document.querySelector(`[data-status-variant="${variant}"]`),
    ).toBeInTheDocument();
  });

  it("puts the extra action before cancel and confirm", () => {
    render(
      <StatusDialog
        open
        onOpenChange={noop}
        title="Sign in"
        extraAction={{ label: "Not now", onClick: noop }}
        secondaryAction={{ label: "Create an account", onClick: noop }}
        primaryAction={{ label: "Log in", onClick: noop }}
      />,
    );

    expect(buttonNames()).toEqual([
      "Close",
      "Not now",
      "Create an account",
      "Log in",
    ]);
  });

  it("shows fields and holds a disabled confirm", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    render(
      <StatusDialog
        open
        onOpenChange={noop}
        title="Reject this return?"
        primaryAction={{
          label: "Reject",
          disabled: true,
          disabledHint: "Enter a reason",
          onClick,
        }}
      >
        <input aria-label="Reason" />
      </StatusDialog>,
    );

    await user.click(screen.getByRole("button", { name: "Reject" }));

    expect(screen.getByLabelText("Reason")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
