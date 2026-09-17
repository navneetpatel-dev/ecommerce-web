import { describe, it } from "vitest";
import assert from "node:assert/strict";
import {
  filtersToParams,
  parseFacetSelections,
  parseFilters,
  writeRepeatedSearchParam,
} from "../productFilters/index";

describe("productFilters URL attrs (F-20 system 1)", () => {
  it("round-trips attrs through filtersToParams and parseFilters", () => {
    const params = filtersToParams({
      search: "shirt",
      page: 1,
      attrs: { color: ["Red", "Blue"] },
    });
    assert.deepEqual(params.getAll("color"), ["Red", "Blue"]);
    assert.equal(params.get("search"), "shirt");
    assert.equal(params.has("page"), false);

    const parsed = parseFilters(params);
    assert.deepEqual(parsed.attrs, { color: ["Red", "Blue"] });
    assert.equal(parsed.search, "shirt");
  });
});

describe("facet URL encoding (F-20 system 2)", () => {
  it("round-trips a facet value that contains a literal comma", () => {
    const params = new URLSearchParams();
    writeRepeatedSearchParam(params, "storage", ["16GB, 128GB", "256GB"]);

    assert.deepEqual(params.getAll("storage"), ["16GB, 128GB", "256GB"]);
    assert.notEqual(params.get("storage"), "16GB, 128GB,256GB");

    const selected = parseFacetSelections(params);
    assert.deepEqual(selected.storage, ["16GB, 128GB", "256GB"]);
  });
});
