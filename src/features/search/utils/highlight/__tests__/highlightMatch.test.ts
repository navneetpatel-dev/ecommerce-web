import { describe, expect, it } from "vitest";
import { highlightMatch } from "../highlightMatch";

describe("highlightMatch (B-15)", () => {
  it("marks every case-insensitive match", () => {
    expect(highlightMatch("Audio Plus audio", "AUD")).toEqual([
      { text: "Aud", match: true },
      { text: "io Plus ", match: false },
      { text: "aud", match: true },
      { text: "io", match: false },
    ]);
  });

  it("treats regex characters in the term literally", () => {
    expect(highlightMatch("C++ guide", "c++")).toEqual([
      { text: "C++", match: true },
      { text: " guide", match: false },
    ]);
  });

  it("returns the text whole when nothing is typed", () => {
    expect(highlightMatch("Books", "  ")).toEqual([
      { text: "Books", match: false },
    ]);
  });
});
