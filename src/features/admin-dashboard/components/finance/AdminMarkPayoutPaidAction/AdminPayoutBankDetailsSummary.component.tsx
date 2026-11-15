import { adminMarkPayoutPaidActionStyles as styles } from "../../../styles/finance/adminMarkPayoutPaidAction.styles";

interface AdminPayoutBankDetailsSummaryProps {
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
  } | null;
}

export function AdminPayoutBankDetailsSummary({
  bankDetails,
}: AdminPayoutBankDetailsSummaryProps) {
  if (!bankDetails) {
    return (
      <div className={styles.noBankNotice}>
        No bank settlement details registered for this vendor.
      </div>
    );
  }

  return (
    <div className={styles.bankDetailsCard}>
      <p className={styles.bankDetailsTitle}>
        <span>Settlement Account Details</span>
      </p>
      <div className={styles.bankDetailsGrid}>
        <div>
          <span className={styles.bankDetailsLabel}>Bank:</span>{" "}
          <span className={styles.bankDetailsValue}>
            {bankDetails.bankName || "—"}
          </span>
        </div>
        <div>
          <span className={styles.bankDetailsLabel}>Account Holder:</span>{" "}
          <span className={styles.bankDetailsValue}>
            {bankDetails.accountHolderName || "—"}
          </span>
        </div>
        <div>
          <span className={styles.bankDetailsLabel}>Account No:</span>{" "}
          <span className={styles.bankDetailsMono}>
            {bankDetails.accountNumber || "—"}
          </span>
        </div>
        <div>
          <span className={styles.bankDetailsLabel}>IFSC:</span>{" "}
          <span className={styles.bankDetailsMono}>
            {bankDetails.ifscCode || "—"}
          </span>
        </div>
        {bankDetails.branchName ? (
          <div className={styles.bankDetailsFullWidth}>
            <span className={styles.bankDetailsLabel}>Branch:</span>{" "}
            <span className={styles.bankDetailsValue}>
              {bankDetails.branchName}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
