import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LABELS } from "@/shared/constants/labels";
import { SEO_LIMITS } from "@/shared/constants/seo/seoLimits";
import { SeoFieldsSection } from "../SeoFieldsSection.component";

function renderSection(
  over: { title?: string; description?: string; error?: string } = {},
) {
  const onTitle = vi.fn();
  const onDescription = vi.fn();
  render(
    <SeoFieldsSection
      seoTitle={{
        value: over.title ?? "",
        onChange: onTitle,
        error: over.error,
      }}
      seoDescription={{
        value: over.description ?? "",
        onChange: onDescription,
      }}
      fallbackTitle="Steel Stock Pot"
      fallbackDescription="A 5 litre pot."
    />,
  );
  return { onTitle, onDescription };
}

describe("the shared SEO section (products and categories)", () => {
  it("has the title and description with hints, counters at the API limits, and the preview", () => {
    renderSection();
    expect(screen.getByLabelText(LABELS.seoTitleLabel)).toHaveAttribute(
      "maxlength",
      String(SEO_LIMITS.TITLE_MAX),
    );
    expect(screen.getByLabelText(LABELS.seoDescriptionLabel)).toHaveAttribute(
      "maxlength",
      String(SEO_LIMITS.DESCRIPTION_MAX),
    );
    expect(screen.getByText(LABELS.seoTitleHint)).toBeInTheDocument();
    expect(screen.getByText(`0 / ${SEO_LIMITS.TITLE_MAX}`)).toBeInTheDocument();
    expect(screen.getByText(LABELS.seoPreviewCaption)).toBeInTheDocument();
  });

  it("the preview falls back to the name and description, and follows what is typed", () => {
    renderSection();
    expect(screen.getAllByText("Steel Stock Pot").length).toBeGreaterThan(0);
    expect(screen.getByText("A 5 litre pot.")).toBeInTheDocument();
  });

  it("reports edits to each field and shows an error under the title", () => {
    const { onTitle, onDescription } = renderSection({ error: "Too long" });
    fireEvent.change(screen.getByLabelText(LABELS.seoTitleLabel), {
      target: { value: "Buy pot" },
    });
    fireEvent.change(screen.getByLabelText(LABELS.seoDescriptionLabel), {
      target: { value: "Best pot" },
    });
    expect(onTitle).toHaveBeenCalledWith("Buy pot");
    expect(onDescription).toHaveBeenCalledWith("Best pot");
    expect(screen.getByText("Too long")).toBeInTheDocument();
  });
});
