import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LABELS } from "@/shared/constants/labels";
import { ApproveOwnWorkDialog } from "../ApproveOwnWorkDialog.component";

describe("approving your own work (Super Admin)", () => {
  const confirmButton = () =>
    screen.getByRole("button", { name: LABELS.approveOwnWorkConfirm });

  function renderDialog(onConfirm = vi.fn().mockResolvedValue(undefined)) {
    render(
      <ApproveOwnWorkDialog open onConfirm={onConfirm} onClose={vi.fn()} />,
    );
    return onConfirm;
  }

  it("cannot be confirmed until a reason of 10 characters is given", () => {
    renderDialog();
    expect(confirmButton()).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "short" },
    });
    expect(confirmButton()).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Sole admin; vendor agreed by phone" },
    });
    expect(confirmButton()).toBeEnabled();
  });

  it("sends the trimmed reason", async () => {
    const onConfirm = renderDialog();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Sole admin; vendor agreed by phone  " },
    });
    fireEvent.click(confirmButton());
    await waitFor(() =>
      expect(onConfirm).toHaveBeenCalledWith(
        "Sole admin; vendor agreed by phone",
      ),
    );
  });

  it("shows how many characters are used", () => {
    renderDialog();
    expect(screen.getByText("0 / 500")).toBeInTheDocument();
  });
});
