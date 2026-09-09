"use client";

import { bulkImportAgentsDialogStyles as styles } from "../../../styles/delivery-agents/bulkImportAgentsDialog.styles";

export function RequiredColumnsInfo() {
  return (
    <div className={styles.schemaContainer}>
      <div className={styles.schemaHeader}>
        <span className={styles.schemaTitle}>Required spreadsheet columns</span>
        <span className={styles.requiredHint}>
          <span className={styles.asteriskPrefix}>*</span> required field
        </span>
      </div>
      <div className={styles.columnsWrapper}>
        <span className={styles.columnChip}>
          email<span className={styles.asterisk}>*</span>
        </span>
        <span className={styles.columnChip}>
          password<span className={styles.asterisk}>*</span>
        </span>
        <span className={styles.columnChip}>
          fullName<span className={styles.asterisk}>*</span>
        </span>
        <span className={styles.columnChip}>
          phone<span className={styles.asterisk}>*</span>
        </span>
        <span className={styles.columnChip}>
          hubOrZone<span className={styles.asterisk}>*</span>
        </span>
        <span className={styles.columnChipOptional}>
          vehicleType{" "}
          <span className={styles.vehicleSubtext}>(BIKE, SCOOTER, VAN)</span>
        </span>
      </div>
      <p className={styles.schemaFooter}>
        The first row must contain column headers. Up to 200 agents per upload
        batch.
      </p>
    </div>
  );
}
