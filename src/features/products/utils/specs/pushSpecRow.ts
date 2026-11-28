import type { SpecRow } from "../../types/specs/specifications.types";

/** Adds a row unless it is empty or its label is already listed. */
export function pushUniqueRow(
  rows: SpecRow[],
  seen: Set<string>,
  label: string,
  value: unknown,
) {
  if (value == null) return;
  const stringValue = typeof value === "string" ? value : String(value);
  const normalized = label.trim().toLowerCase();
  if (!stringValue.trim() || seen.has(normalized)) return;
  seen.add(normalized);
  rows.push({ label: label.trim(), value: stringValue.trim() });
}
