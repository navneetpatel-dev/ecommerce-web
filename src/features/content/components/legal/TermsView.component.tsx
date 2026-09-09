import { contentDocStyles as styles } from "../../styles/legal/contentDoc.styles";

export function TermsView() {
  return (
    <div className={styles.proseContainer}>
      <h1 className={styles.h1}>Terms of Service</h1>
      <p className={styles.bodyText}>
        By using Marketplace, you agree to follow platform policies for account
        usage, order behavior, and vendor interactions.
      </p>
      <h2 className={styles.h2}>Orders and payments</h2>
      <p className={styles.bodyText}>
        Orders may be split by vendor. Payment and refund timelines follow the
        selected payment method and applicable policy.
      </p>
      <h2 className={styles.h2}>Returns and disputes</h2>
      <p className={styles.bodyText}>
        Return eligibility depends on item type, vendor policy, and order state.
        Disputes are handled through support review.
      </p>
    </div>
  );
}
