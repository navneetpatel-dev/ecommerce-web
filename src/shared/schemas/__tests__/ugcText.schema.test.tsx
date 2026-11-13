import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { CharacterCount } from "@/shared/components/forms/CharacterCount.component";
import { isUgcTextValid, ugcTextSchema } from "../ugcText.schema";

describe("ugcTextSchema", () => {
  const schema = ugcTextSchema("Question", UGC_LIMITS.question);

  it("trims and enforces the shared limits with the API's wording", () => {
    expect(schema.safeParse("  short  ").error?.issues[0]?.message).toBe(
      "Question must be at least 10 characters",
    );
    expect(schema.safeParse("q".repeat(301)).error?.issues[0]?.message).toBe(
      "Question must be at most 300 characters",
    );
    expect(schema.parse("  Does it fit true to size?  ")).toBe(
      "Does it fit true to size?",
    );
  });

  it("gates submit on trimmed length", () => {
    expect(isUgcTextValid("   Yes   ", UGC_LIMITS.answer)).toBe(true);
    expect(isUgcTextValid(" ok ", UGC_LIMITS.answer)).toBe(false);
  });
});

describe("CharacterCount", () => {
  it("shows the count and how many characters are still needed", () => {
    render(
      <CharacterCount id="c" value="Is it" limits={UGC_LIMITS.question} />,
    );
    expect(screen.getByText("5 / 300")).toBeInTheDocument();
    expect(screen.getByText("5 more characters needed")).toBeInTheDocument();
  });
});

describe("ExpandableText", () => {
  it("flows paragraphs together while clamped and restores them when expanded", async () => {
    const { ExpandableText } =
      await import("@/shared/components/display/ExpandableText.component");
    const { default: userEvent } = await import("@testing-library/user-event");
    const text = `${"First paragraph. ".repeat(15)}\n\n${"Second paragraph. ".repeat(15)}`;
    render(<ExpandableText text={text} threshold={100} />);
    expect(screen.getByText(/First paragraph\./).textContent).not.toContain(
      "\n",
    );
    await userEvent.click(screen.getByRole("button", { name: /Read more/ }));
    expect(screen.getByText(/First paragraph\./).textContent).toContain("\n\n");
  });
});
