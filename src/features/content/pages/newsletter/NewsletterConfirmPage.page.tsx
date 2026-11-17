"use client";

import { NewsletterConfirmView } from "../../components/newsletter/NewsletterConfirmView.component";
import { useNewsletterConfirmPage } from "../../hooks/newsletter/useNewsletterConfirmPage.hook";

export function NewsletterConfirmPage() {
  const page = useNewsletterConfirmPage();
  return (
    <NewsletterConfirmView
      hasToken={page.hasToken}
      isPending={page.isPending}
      isDone={page.isDone}
      error={page.error}
      onConfirm={page.handleConfirm}
    />
  );
}
