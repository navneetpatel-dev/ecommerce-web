import { describe, expect, it } from "vitest";
import { parseAgentsCsv, MAX_ROWS } from "../parseAgentsCsv";

const HEADER = "email,password,fullName,phone,vehicleType,hubOrZone";

describe("parseAgentsCsv", () => {
  it("parses valid rows", () => {
    const csv = `${HEADER}\njane@example.com,secret123,Jane Doe,9999999999,BIKE,North Hub`;

    const { rows, errors } = parseAgentsCsv(csv);

    expect(errors).toEqual([]);
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

  it("rejects a header missing a required column with a column-scoped error", () => {
    const csv = "email,password,fullName,phone,hubOrZone\na@b.com,x,y,z,hub";

    const { rows, errors } = parseAgentsCsv(csv);

    expect(rows).toEqual([]);
    expect(errors).toEqual([
      {
        row: 1,
        column: "vehicleType",
        message: "Missing required column",
      },
    ]);
  });

  it("rejects a file with only a header row", () => {
    const { rows, errors } = parseAgentsCsv(HEADER);

    expect(rows).toEqual([]);
    expect(errors[0]?.message).toMatch(/header row and at least one data row/);
  });

  it("rejects a file exceeding the row limit", () => {
    const dataRows = Array.from(
      { length: MAX_ROWS + 1 },
      (_, i) => `a${i}@example.com,secret,Name ${i},999,BIKE,Hub`,
    ).join("\n");
    const csv = `${HEADER}\n${dataRows}`;

    const { rows, errors } = parseAgentsCsv(csv);

    expect(rows).toEqual([]);
    expect(errors[0]?.message).toMatch(new RegExp(`${MAX_ROWS}-row limit`));
  });

  it("reports a required-field error on the originating data row", () => {
    const valid =
      "ok@example.com,secret123,Name,9999999999,BIKE,North Hub";
    const rows = [valid, valid, valid, valid, ",secret123,Name,9999999999,BIKE,North Hub"];
    const csv = `${HEADER}\n${rows.join("\n")}`;

    const { rows: parsed, errors } = parseAgentsCsv(csv);

    expect(parsed).toEqual([]);
    expect(errors).toContainEqual({
      row: 5,
      column: "email",
      message: "This field is required",
    });
  });
});
