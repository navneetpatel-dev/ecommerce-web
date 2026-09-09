import { contentDocStyles as styles } from "../../styles/legal/contentDoc.styles";

export function PrivacyView() {
  return (
    <div className={styles.proseContainer}>
      <h1 className={styles.h1}>Privacy Policy</h1>
      <p className={styles.bodyText}>
        We collect account, order, and usage information required to provide
        marketplace functionality, shipping, payments, and support.
      </p>
      <h2 className={styles.h2}>How we use data</h2>
      <p className={styles.bodyText}>
        Data is used to process orders, prevent abuse, and improve product
        experience. Vendor-facing information is limited to what is required for
        fulfillment.
      </p>
      <h2 className={styles.h2}>Contact</h2>
      <p className={styles.bodyText}>
        For privacy questions, contact privacy@marketplace.local.
      </p>
    </div>
  );
}
