import { describe, expect, it } from "vitest";
import { parseAgentsCsv, MAX_ROWS } from "../parseAgentsCsv";

const HEADER = "email,password,fullName,phone,vehicleType,hubOrZone";

describe("parseAgentsCsv", () => {
  it("parses valid rows", () => {
    const csv = `${HEADER}\njane@example.com,secret123,Jane Doe,9999999999,BIKE,North Hub`;

    const { rows, error } = parseAgentsCsv(csv);

    expect(error).toBeNull();
    expect(rows).toEqual([
      {
        email: "jane@example.com",
        password: "secret123",
        fullName: "Jane Doe",
        phone: "9999999999",
        vehicleType: "BIKE",
        hubOrZone: "North Hub",
      },
    ]);
  });

  it("defaults a missing vehicleType cell to BIKE", () => {
    const csv = `${HEADER}\njane@example.com,secret123,Jane Doe,9999999999,,North Hub`;

    const { rows } = parseAgentsCsv(csv);

    expect(rows[0]?.vehicleType).toBe("BIKE");
  });

  it("rejects a header missing a required column", () => {
    const csv = "email,password,fullName,phone,hubOrZone\na@b.com,x,y,z,hub";

    const { rows, error } = parseAgentsCsv(csv);

    expect(rows).toEqual([]);
    expect(error).toMatch(/Missing column/);
    expect(error).toMatch(/vehicleType/);
  });

  it("rejects a file with only a header row", () => {
    const { rows, error } = parseAgentsCsv(HEADER);

    expect(rows).toEqual([]);
    expect(error).toMatch(/header row and at least one data row/);
  });

  it("rejects a file exceeding the row limit", () => {
    const dataRows = Array.from(
      { length: MAX_ROWS + 1 },
      (_, i) => `a${i}@example.com,secret,Name ${i},999,BIKE,Hub`,
    ).join("\n");
    const csv = `${HEADER}\n${dataRows}`;

    const { rows, error } = parseAgentsCsv(csv);

    expect(rows).toEqual([]);
    expect(error).toMatch(new RegExp(`${MAX_ROWS}-row limit`));
  });
});
