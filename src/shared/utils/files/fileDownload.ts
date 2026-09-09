/**
 * Triggers a client-side download of arbitrary text/JSON content (Rule 1:
 * DOM/file plumbing lives in utils, not components). Creates an object URL,
 * clicks a temporary anchor, and revokes the URL afterwards.
 */
function saveTextFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Builds the dated filename for an account data export. */
export function accountExportFilename(prefix: string): string {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.json`;
}

/** Serializes `data` as pretty-printed JSON and saves it via saveTextFile. */
export function saveJsonExport(data: unknown, filenamePrefix: string): void {
  saveTextFile(
    JSON.stringify(data, null, 2),
    accountExportFilename(filenamePrefix),
    "application/json",
  );
}
