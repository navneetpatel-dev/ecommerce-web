import { describe, expect, it } from "vitest";
import { asAuthorSees, revisionState } from "../ugcRevision";

describe("ugc revisions", () => {
  it("names the state of the author's last edit", () => {
    expect(revisionState({ pendingRevision: { answer: "x" } })).toBe("pending");
    expect(revisionState({ revisionRejectedAt: "2026-11-13" })).toBe(
      "declined",
    );
    expect(revisionState({})).toBeNull();
  });

  it("shows the author their waiting edit over the live text", () => {
    const live = {
      id: "a",
      answer: "Old",
      pendingRevision: { answer: "New", submittedAt: "t" },
    };
    expect(asAuthorSees(live)).toMatchObject({ id: "a", answer: "New" });
    expect(asAuthorSees(live)).not.toHaveProperty("submittedAt");
    const unchanged: { id: string; answer: string; pendingRevision?: null } = {
      id: "b",
      answer: "Same",
    };
    expect(asAuthorSees(unchanged)).toBe(unchanged);
  });
});
