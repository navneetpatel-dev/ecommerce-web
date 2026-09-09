import { Bell } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import type { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";

import { deliveryOperationsSectionStyles as styles } from "./deliveryOperationsSection.styles";

interface PushNotificationsSectionProps {
  push: ReturnType<typeof usePushSubscription>;
}

export function PushNotificationsSection({
  push,
}: PushNotificationsSectionProps) {
  const errorNotice = push.error ? (
    <p className={styles.errorNotice}>{push.error}</p>
  ) : null;
  const switchDisabled = !push.supported || push.pending;

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <TextEyebrow>DEVICE ALERTS</TextEyebrow>
        <h2 className={styles.sectionTitle}>Task push notifications</h2>
        <p className={styles.sectionSubtitle}>
          Receive instant alerts on this device whenever tasks are assigned or
          updated.
        </p>
      </div>

      <div className={styles.sectionBody}>
        <div className={styles.innerCard}>
          <div className={styles.innerCardLeft}>
            <span className={styles.iconBox}>
              <Bell size={18} strokeWidth={1.5} />
            </span>
            <div className={styles.textCol}>
              <span className={styles.titleText}>
                Real-time device notifications
              </span>
              <p className={styles.bodyText}>
                Receive audible alerts and task updates directly in your browser
                or device lockscreen.
              </p>
              {errorNotice}
            </div>
          </div>

          <div className={styles.switchCol}>
            <Switch
              checked={push.enabled}
              disabled={switchDisabled}
              onCheckedChange={(checked) => void push.toggle(checked)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
