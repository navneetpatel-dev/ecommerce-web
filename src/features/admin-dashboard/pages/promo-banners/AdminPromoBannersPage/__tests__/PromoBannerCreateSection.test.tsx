import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { PromoBannerCreateDialog } from "../PromoBannerCreateSection.component";
import {
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_STATUS,
} from "@/shared/constants/statuses";

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("PromoBannerCreateDialog - Modal Dialog behavior", () => {
  const defaultProps = {
    open: false,
    onOpenChange: vi.fn(),
    draftId: "draft-123",
    title: "",
    onTitleChange: vi.fn(),
    imageUrl: null,
    onImageUploaded: vi.fn(),
    linkType: PROMO_BANNER_LINK_TYPE.URL,
    onLinkTypeChange: vi.fn(),
    status: PROMO_BANNER_STATUS.DRAFT,
    onStatusChange: vi.fn(),
    linkUrl: "",
    onLinkUrlChange: vi.fn(),
    linkTargetId: "",
    onLinkTargetIdChange: vi.fn(),
    priority: "0",
    onPriorityChange: vi.fn(),
    saving: false,
    message: null,
    canSubmit: true,
    disableHint: "",
    onCreate: vi.fn(),
  };

  it("does not render dialog content when open is false", () => {
    renderWithClient(
      <PromoBannerCreateDialog {...defaultProps} open={false} />,
    );

    expect(
      screen.queryByPlaceholderText(/summer flash sale/i),
    ).not.toBeInTheDocument();
  });

  it("renders dialog content and form fields when open is true", () => {
    renderWithClient(<PromoBannerCreateDialog {...defaultProps} open={true} />);

    expect(
      screen.getByPlaceholderText(/summer flash sale/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create banner/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when Cancel is clicked", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderWithClient(
      <PromoBannerCreateDialog
        {...defaultProps}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("triggers onCreate when submit button is clicked", async () => {
    const onCreate = vi.fn();
    const user = userEvent.setup();
    renderWithClient(
      <PromoBannerCreateDialog
        {...defaultProps}
        open={true}
        canSubmit={true}
        onCreate={onCreate}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /create banner/i });
    await user.click(submitBtn);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});
