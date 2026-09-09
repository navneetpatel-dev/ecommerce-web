"use client";

import { usePushSubscription } from "@/shared/hooks/usePushSubscription.hook";

export function useBrowserNotificationsSetting() {
  const push = usePushSubscription();

  const handleCheckedChange = (checked: boolean) => {
    void push.toggle(checked);
  };

  const isSwitchDisabled = !push.supported || push.pending;
  const showUnsupportedNotice = !push.supported;
  const errorNotice = push.error;

  return {
    isEnabled: push.enabled,
    isSwitchDisabled,
    showUnsupportedNotice,
    errorNotice,
    handleCheckedChange,
  };
}
