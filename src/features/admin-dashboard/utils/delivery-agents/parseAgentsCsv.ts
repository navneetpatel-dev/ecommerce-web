export const EXPECTED_COLUMNS = [
  "email",
  "password",
  "fullName",
  "phone",
  "vehicleType",
  "hubOrZone",
] as const;

export const MAX_ROWS = 200;
export const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

const REQUIRED_CELL_COLUMNS = [
  "email",
  "password",
  "fullName",
  "phone",
  "hubOrZone",
] as const;

export interface ParsedRow {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  hubOrZone: string;
}

export type CsvParseError = {
  row: number;
  column?: string;
  message: string;
};

/**
 * Minimal CSV parser for a fixed, simple column set (no library — this app has no CSV
 * import precedent, and agent onboarding data is not expected to contain embedded commas
 * or quoted fields).
 */
export function parseAgentsCsv(text: string): {
  rows: ParsedRow[];
  errors: CsvParseError[];
} {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message: "CSV must have a header row and at least one data row.",
        },
      ],
    };
  }
  if (lines.length - 1 > MAX_ROWS) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message: `CSV file exceeds the ${MAX_ROWS}-row limit (found ${lines.length - 1} rows).`,
        },
      ],
    };
  }
  const firstLine = lines[0] ?? "";
  const header = firstLine.split(",").map((cell) => cell.trim());
  const missing = EXPECTED_COLUMNS.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    return {
      rows: [],
      errors: missing.map((column) => ({
        row: 1,
        column,
        message: "Missing required column",
      })),
    };
  }

  const rows: ParsedRow[] = [];
  const errors: CsvParseError[] = [];

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 1;
    const cells = line.split(",").map((cell) => cell.trim());
    const record: Record<string, string> = {};
    header.forEach((col, colIndex) => {
      record[col] = cells[colIndex] ?? "";
    });

    for (const column of REQUIRED_CELL_COLUMNS) {
      if (!record[column]) {
        errors.push({
          row: rowNumber,
          column,
          message: "This field is required",
        });
      }
    }

    rows.push({
      email: record.email || "",
      password: record.password || "",
      fullName: record.fullName || "",
      phone: record.phone || "",
      vehicleType: record.vehicleType || "BIKE",
      hubOrZone: record.hubOrZone || "",
    });
  });

  return { rows: errors.length > 0 ? [] : rows, errors };
}
