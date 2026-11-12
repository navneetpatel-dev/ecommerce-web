import { describe, expect, it } from "vitest";
import type { Address } from "@/shared/api/types";
import { filterAddresses } from "../addressSearch";

const address = (id: string, fields: Partial<Address>): Address =>
  ({
    id,
    userId: "u",
    line1: "",
    line2: null,
    city: "",
    state: "",
    country: "India",
    pincode: "",
    isDefault: false,
    ...fields,
  }) as Address;

const book = [
  address("a", { city: "Pune", pincode: "411001", recipientName: "Asha Rao" }),
  address("b", { city: "Mumbai", pincode: "400001", isDefault: true }),
  address("c", { city: "Delhi", pincode: "110001", line1: "12 Park Street" }),
];

describe("filterAddresses (C-15)", () => {
  it("puts the default address first", () => {
    expect(filterAddresses(book, "").map((a) => a.id)).toEqual(["b", "a", "c"]);
  });

  it("matches name, city, street or PIN, ignoring case", () => {
    expect(filterAddresses(book, "asha").map((a) => a.id)).toEqual(["a"]);
    expect(filterAddresses(book, "mum").map((a) => a.id)).toEqual(["b"]);
    expect(filterAddresses(book, "park").map((a) => a.id)).toEqual(["c"]);
    expect(filterAddresses(book, "110001").map((a) => a.id)).toEqual(["c"]);
  });
});
