import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipToContentLink } from "../SkipToContentLink.component";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
import { skipToContentLinkStyles } from "@/shared/styles/a11y/skipLink.styles";

describe("SkipToContentLink", () => {
  it("is the first focusable element and targets the main landmark", () => {
    render(<SkipToContentLink />);

    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toHaveAttribute("href", `#${MAIN_CONTENT_ID}`);
  });

  it("stays hidden until focused, then becomes a real button-sized target", () => {
    render(<SkipToContentLink />);

    expect(skipToContentLinkStyles.link).toContain("sr-only");
    expect(skipToContentLinkStyles.link).toContain("focus:not-sr-only");
    expect(skipToContentLinkStyles.link).toContain("focus:fixed");
  });

  it("clears the status bar when it appears on a notched device", () => {
    // `viewport-fit=cover` means the link must offset itself from the top edge.
    expect(skipToContentLinkStyles.link).toContain(
      "env(safe-area-inset-top,0px)",
    );
    expect(skipToContentLinkStyles.link).toContain(
      "env(safe-area-inset-left,0px)",
    );
  });
});
