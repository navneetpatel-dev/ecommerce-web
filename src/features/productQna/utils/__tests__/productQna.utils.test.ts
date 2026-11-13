import { describe, expect, it } from "vitest";
import { answerCountLabel, moreAnswersLabel } from "../productQna.utils";

describe("answer thread labels", () => {
  it("labels the expand toggle in the singular and plural, with Indian grouping", () => {
    expect(moreAnswersLabel(1)).toBe("See 1 more answer");
    expect(moreAnswersLabel(2)).toBe("See 2 more answers");
    expect(moreAnswersLabel(120430)).toBe("See 1,20,430 more answers");
  });

  it("counts answers the same way", () => {
    expect(answerCountLabel(1)).toBe("1 answer");
    expect(answerCountLabel(250000)).toBe("2,50,000 answers");
  });
});
