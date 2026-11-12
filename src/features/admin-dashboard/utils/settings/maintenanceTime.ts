/** Two-digit pad for the datetime-local value. */
const pad = (value: number) => String(value).padStart(2, "0");

/** ISO time → the `YYYY-MM-DDTHH:mm` value a datetime-local input shows, in the admin's own time zone. */
export function toLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** A datetime-local value → ISO time for the API; empty or invalid clears it. */
export function fromLocalInputValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
