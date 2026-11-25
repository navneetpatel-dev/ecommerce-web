import { describe, expect, it } from "vitest";
import { categorizeDetailFields } from "../recordDetailCategorize";
import type { RecordDetailField } from "../recordDetails";

describe("categorizeDetailFields", () => {
  it("promotes long/narrative text to spotlight, hides empty primitives, and moves UUIDs/raw flags to system", () => {
    const fields: RecordDetailField[] = [
      { key: "id", label: "ID", value: "43c29c66-beb1-4d14-9272-207eac5e597d" },
      { key: "kind", label: "Kind", value: "Answer" },
      {
        key: "onQuestion",
        label: "On Question",
        value: "Is the colour the same as in the photos?",
      },
      {
        key: "text",
        label: "Text",
        value: "Returned my first one for a size swap, exchange was easy",
      },
      { key: "vendor", label: "Vendor", value: "" },
      { key: "liveVersion", label: "Live Version", value: null },
      { key: "rawKind", label: "Raw Kind", value: "ANSWER" },
      { key: "isEdit", label: "Is Edit", value: false },
      {
        key: "photoUrls",
        label: "Customer Photos",
        value: ["https://cdn.example.com/a.jpg"],
      },
      {
        key: "createdAt",
        label: "Submitted At",
        value: "2026-11-01T17:18:00Z",
      },
    ];

    const res = categorizeDetailFields(fields);
    expect(res.media.map((f) => f.key)).toEqual(["photoUrls"]);
    expect(res.spotlight.map((f) => f.key)).toEqual(["onQuestion", "text"]);
    expect(res.properties.map((f) => f.key)).toEqual(["kind"]);
    expect(res.system.map((f) => f.key)).toEqual([
      "id",
      "rawKind",
      "isEdit",
      "createdAt",
    ]);
  });
});
