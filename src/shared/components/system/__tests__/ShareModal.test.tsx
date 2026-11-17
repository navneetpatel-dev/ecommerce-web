import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShareModal } from "../ShareModal.component";

describe("ShareModal component", () => {
  const defaultProps = {
    title: "Bracelets Classic 394",
    shareUrl: "http://localhost:5273/s/rx22Xnc",
    imageUrl: "https://example.com/photo.jpg",
    price: 2188.89,
    copied: false,
    onCopyLink: vi.fn(),
    onShareSocial: vi.fn(),
    open: true,
  };

  it("renders product title, price, and short URL in the dialog", () => {
    render(<ShareModal {...defaultProps} />);
    expect(screen.getByText("Bracelets Classic 394")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("http://localhost:5273/s/rx22Xnc"),
    ).toBeInTheDocument();
    expect(screen.getByText("Share this product")).toBeInTheDocument();
  });

  it("triggers onCopyLink when the copy button is clicked", () => {
    const onCopy = vi.fn();
    render(<ShareModal {...defaultProps} onCopyLink={onCopy} />);
    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("displays Copied! status when copied is true", () => {
    render(<ShareModal {...defaultProps} copied={true} />);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("triggers social share on clicking WhatsApp, Facebook, X, etc.", () => {
    const onSocial = vi.fn();
    render(<ShareModal {...defaultProps} onShareSocial={onSocial} />);

    fireEvent.click(screen.getByRole("button", { name: /Share on WhatsApp/i }));
    expect(onSocial).toHaveBeenCalledWith("whatsapp");

    fireEvent.click(screen.getByRole("button", { name: /Share on Facebook/i }));
    expect(onSocial).toHaveBeenCalledWith("facebook");

    fireEvent.click(screen.getByRole("button", { name: /Share on X/i }));
    expect(onSocial).toHaveBeenCalledWith("twitter");

    fireEvent.click(screen.getByRole("button", { name: /Share on Telegram/i }));
    expect(onSocial).toHaveBeenCalledWith("telegram");

    fireEvent.click(
      screen.getByRole("button", { name: /Share on Pinterest/i }),
    );
    expect(onSocial).toHaveBeenCalledWith("pinterest");

    fireEvent.click(screen.getByRole("button", { name: /Share on LinkedIn/i }));
    expect(onSocial).toHaveBeenCalledWith("linkedin");

    fireEvent.click(screen.getByRole("button", { name: /Share via Email/i }));
    expect(onSocial).toHaveBeenCalledWith("email");
  });
});
