const KNOWN_BULK_IMPORT_ERRORS: Record<string, string> = {
  "Email already registered": "This email is already in use",
  "Delivery agent role is not seeded":
    "Delivery agent role is missing — contact an administrator",
};

/** Maps known backend bulk-create messages to friendlier copy; otherwise keeps the raw string. */
export function formatBulkAgentImportError(error: string | null): string {
  if (!error) return "Failed";
  return KNOWN_BULK_IMPORT_ERRORS[error] ?? error;
}
