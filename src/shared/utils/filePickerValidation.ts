export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface FilePickerValidationRules {
  maxBytes?: number;
  maxRows?: number;
  validate?: (file: File) => string | null | Promise<string | null>;
}

/** Runs FilePicker's validation chain (size limit, CSV row-count limit, custom rule) on a file. */
export async function validateFilePickerFile(
  file: File,
  { maxBytes, maxRows, validate }: FilePickerValidationRules,
): Promise<string | null> {
  if (maxBytes && file.size > maxBytes) {
    return `File size exceeds the ${formatFileSize(maxBytes)} limit (chosen: ${formatFileSize(file.size)}).`;
  }

  if (maxRows && (file.name.endsWith(".csv") || file.type.includes("csv"))) {
    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);
      const rowCount = Math.max(0, lines.length - 1); // exclude header row
      if (rowCount > maxRows) {
        return `CSV file exceeds the ${maxRows}-row limit (found ${rowCount} rows).`;
      }
    } catch {
      // If reading text fails, let the parent component handle parsing errors
    }
  }

  if (validate) {
    const customErr = await validate(file);
    if (customErr) return customErr;
  }

  return null;
}
