import { contentDocStyles as styles } from "./contentDoc.styles";

export function AboutView() {
  return (
    <div className={styles.proseContainerSpaced}>
      <h1 className={styles.h1}>About Marketplace</h1>
      <p className={styles.bodyText}>
        Marketplace connects shoppers with independent vendors across
        categories. We focus on trusted buying, clear vendor identity, and
        predictable checkout for multi-vendor orders.
      </p>
      <p className={styles.bodyText}>
        Every order may include products from different vendors, and each vendor
        is responsible for inventory, shipping, and fulfillment timelines.
      </p>
    </div>
  );
}
