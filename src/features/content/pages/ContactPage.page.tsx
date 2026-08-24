"use client";

import { useContactPage } from "../hooks/useContactPage.hook";
import { ContactView } from "../components/ContactView.component";

export function ContactPage() {
  const { supportEmail, supportHours, isLoading } = useContactPage();
  return (
    <ContactView
      supportEmail={supportEmail}
      supportHours={supportHours}
      isLoading={isLoading}
    />
  );
}
