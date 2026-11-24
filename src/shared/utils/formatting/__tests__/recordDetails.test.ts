import { describe, expect, it } from "vitest";
import {
  buildRecordDetailFields,
  getRecordDetailTitle,
} from "../recordDetails";

describe("recordDetails formatting and sanitization", () => {
  it("maps photo and evidence fields to human labels and hides internal technical IDs", () => {
    const returnRow = {
      id: "a1b2c3d4-0000-0000-0000-000000000000",
      returnReference: "#RET-A1B2C3D4",
      orderReference: "#B2C3D4E5",
      productName: "Sneakers",
      customerName: "Amit Das",
      orderItemId: "b2c3d4e5-1111-2222-3333-444455556666",
      subOrderId: "c3d4e5f6-1111-2222-3333-444455556666",
      photoUrls: [],
      disputeEvidenceUrls: ["https://example.com/evidence1.jpg"],
      refundAmount: 1500,
    };

    const fields = buildRecordDetailFields(returnRow);
    const keys = fields.map((f) => f.key);
    const labelMap = Object.fromEntries(fields.map((f) => [f.key, f.label]));

    // Technical UUID IDs must be omitted
    expect(keys).not.toContain("orderItemId");
    expect(keys).not.toContain("subOrderId");
    expect(keys).not.toContain("id");

    // Human labels
    expect(labelMap.photoUrls).toBe("Customer Photos");
    expect(labelMap.disputeEvidenceUrls).toBe("Dispute Evidence Photos");
    expect(labelMap.returnReference).toBe("Return ID");
    expect(labelMap.orderReference).toBe("Order");
  });

  it("extracts clean title from best candidate", () => {
    expect(getRecordDetailTitle({ productName: "Phone" })).toBe("Phone");
    expect(getRecordDetailTitle({ customerName: "Rahul" })).toBe("Rahul");
    expect(getRecordDetailTitle({})).toBe("Record details");
  });
});
