import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { productsApi } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { AdminProductRowActions } from "../AdminProductRowActions.component";
import { SubmitOnBehalfDialog } from "../SubmitOnBehalfDialog.component";

vi.mock("@/shared/stores/notifications/toast.store", () => ({
  notifySuccess: vi.fn(),
}));

afterEach(() => vi.restoreAllMocks());

const product = { id: "p1", name: "Lamp" };

function renderActions(status: string, listedByPlatform: boolean) {
  const handlers = {
    onPreview: vi.fn(),
    onEdit: vi.fn(),
    onManageVariants: vi.fn(),
    onSubmitOnBehalf: vi.fn(),
  };
  render(
    <AdminProductRowActions
      product={product}
      status={status}
      listedByPlatform={listedByPlatform}
      {...handlers}
    />,
  );
  return handlers;
}

describe("admin product row actions", () => {
  it("every row can be edited and have its variants managed", () => {
    const handlers = renderActions("LIVE", false);
    fireEvent.click(screen.getByRole("button", { name: LABELS.edit }));
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.manageVariants }),
    );
    expect(handlers.onEdit).toHaveBeenCalledWith("p1");
    expect(handlers.onManageVariants).toHaveBeenCalledWith(product);
  });

  it("submit on the vendor's behalf is offered only for platform-listed drafts and rejected listings", () => {
    for (const [status, listed, shown] of [
      ["DRAFT", true, true],
      ["REJECTED", true, true],
      ["DRAFT", false, false],
      ["PENDING_APPROVAL", true, false],
      ["LIVE", true, false],
    ] as const) {
      const { unmount } = render(
        <AdminProductRowActions
          product={product}
          status={status}
          listedByPlatform={listed}
          onPreview={vi.fn()}
          onEdit={vi.fn()}
          onManageVariants={vi.fn()}
          onSubmitOnBehalf={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: LABELS.submitOnBehalf }) !== null,
      ).toBe(shown);
      unmount();
    }
  });

  it("clicking submit hands the product to the page", () => {
    const handlers = renderActions("DRAFT", true);
    fireEvent.click(
      screen.getByRole("button", { name: LABELS.submitOnBehalf }),
    );
    expect(handlers.onSubmitOnBehalf).toHaveBeenCalledWith(product);
  });
});

describe("submit on the vendor's behalf dialog", () => {
  function renderDialog() {
    const onSubmitted = vi.fn();
    render(
      <SubmitOnBehalfDialog
        productId="p1"
        productName="Lamp"
        open
        onOpenChange={vi.fn()}
        onSubmitted={onSubmitted}
      />,
    );
    return onSubmitted;
  }
  const submitButton = () =>
    screen.getByRole("button", { name: LABELS.submitForReview });

  it("cannot be submitted until the vendor's agreement is recorded (10 characters)", () => {
    renderDialog();
    expect(submitButton()).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "short" },
    });
    expect(submitButton()).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Agreed by phone, ticket 4521" },
    });
    expect(submitButton()).toBeEnabled();
  });

  it("sends the trimmed note for that product, then reports done", async () => {
    const send = vi
      .spyOn(productsApi, "submitOnBehalf")
      .mockResolvedValue({} as never);
    const onSubmitted = renderDialog();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Agreed by phone, ticket 4521  " },
    });
    fireEvent.click(submitButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
    expect(send).toHaveBeenCalledWith("p1", "Agreed by phone, ticket 4521");
  });

  it("shows the server's refusal and stays open", async () => {
    vi.spyOn(productsApi, "submitOnBehalf").mockRejectedValue(
      Object.assign(
        new Error(
          "Cannot submit product for approval without at least one image.",
        ),
        {
          status: 422,
        },
      ),
    );
    const onSubmitted = renderDialog();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Agreed by phone, ticket 4521" },
    });
    fireEvent.click(submitButton());
    await waitFor(() =>
      expect(screen.getByText(/at least one image/i)).toBeInTheDocument(),
    );
    expect(onSubmitted).not.toHaveBeenCalled();
  });
});
