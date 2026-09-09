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

export interface ParsedRow {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  hubOrZone: string;
}

/**
 * Minimal CSV parser for a fixed, simple column set (no library — this app has no CSV
 * import precedent, and agent onboarding data is not expected to contain embedded commas
 * or quoted fields).
 */
export function parseAgentsCsv(text: string): {
  rows: ParsedRow[];
  error: string | null;
} {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      rows: [],
      error: "CSV must have a header row and at least one data row.",
    };
  }
  if (lines.length - 1 > MAX_ROWS) {
    return {
      rows: [],
      error: `CSV file exceeds the ${MAX_ROWS}-row limit (found ${lines.length - 1} rows).`,
    };
  }
  const firstLine = lines[0] ?? "";
  const header = firstLine.split(",").map((cell) => cell.trim());
  const missing = EXPECTED_COLUMNS.filter((col) => !header.includes(col));
  if (missing.length > 0) {
    return { rows: [], error: `Missing column(s): ${missing.join(", ")}` };
  }

  const rows: ParsedRow[] = lines.slice(1).map((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    const record: Record<string, string> = {};
    header.forEach((col, index) => {
      record[col] = cells[index] ?? "";
    });
    return {
      email: record.email || "",
      password: record.password || "",
      fullName: record.fullName || "",
      phone: record.phone || "",
      vehicleType: record.vehicleType || "BIKE",
      hubOrZone: record.hubOrZone || "",
    };
  });

  return { rows, error: null };
}
