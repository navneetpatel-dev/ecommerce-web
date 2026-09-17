import type { CsvParseError } from "../../../utils/delivery-agents/parseAgentsCsv";
import { bulkImportAgentsDialogStyles as styles } from "../../../styles/delivery-agents/bulkImportAgentsDialog.styles";

interface CsvParseErrorListProps {
  errors: CsvParseError[];
}

function formatCsvParseError(entry: CsvParseError): string {
  if (entry.column && entry.row > 0) {
    return `Row ${entry.row}, ${entry.column}: ${entry.message}`;
  }
  if (entry.column) {
    return `${entry.column}: ${entry.message}`;
  }
  if (entry.row > 0) {
    return `Row ${entry.row}: ${entry.message}`;
  }
  return entry.message;
}

function CsvParseErrorItem({ entry }: { entry: CsvParseError }) {
  return <li className={styles.parseErrorItem}>{formatCsvParseError(entry)}</li>;
}

/** Row/column-scoped CSV validation errors shown before an import is submitted. */
export function CsvParseErrorList({ errors }: CsvParseErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className={styles.errorBanner} role="alert">
      <p className={styles.parseErrorHeading}>Could not parse this CSV</p>
      <ul className={styles.parseErrorList}>
        {errors.map((entry) => (
          <CsvParseErrorItem
            key={`${entry.row}-${entry.column ?? "file"}-${entry.message}`}
            entry={entry}
          />
        ))}
      </ul>
    </div>
  );
}
