"use client";

import { UnsubscribeView } from "../../components/unsubscribe/UnsubscribeView.component";
import { useUnsubscribePage } from "../../hooks/unsubscribe/useUnsubscribePage.hook";

export function UnsubscribePage() {
  const page = useUnsubscribePage();
  return (
    <UnsubscribeView
      hasToken={page.hasToken}
      isPending={page.isPending}
      isDone={page.isDone}
      error={page.error}
      onConfirm={page.handleConfirm}
    />
  );
}
