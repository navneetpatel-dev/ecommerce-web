"use client";

import { Bell } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { useBrowserNotificationsSetting } from "./useBrowserNotificationsSetting.hook";
import { browserNotificationsSettingStyles as styles } from "./browserNotificationsSetting.styles";

export function BrowserNotificationsSetting() {
  const {
    isEnabled,
    isSwitchDisabled,
    showUnsupportedNotice,
    errorNotice,
    handleCheckedChange,
  } = useBrowserNotificationsSetting();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <Bell className={styles.bellIcon} aria-hidden="true" />
          <div>
            <h2 className={styles.title}>Browser notifications</h2>
            <p className={styles.description}>
              Receive order, shipment, return, and refund updates on this
              device.
            </p>
            {showUnsupportedNotice && (
              <p className={styles.unsupportedNotice}>
                This browser does not support push notifications.
              </p>
            )}
            {errorNotice && <p className={styles.errorNotice}>{errorNotice}</p>}
          </div>
        </div>
        <Switch
          aria-label="Browser notifications"
          checked={isEnabled}
          disabled={isSwitchDisabled}
          onCheckedChange={handleCheckedChange}
        />
      </div>
    </section>
  );
}
