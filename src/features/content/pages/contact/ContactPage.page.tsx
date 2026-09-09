"use client";

import { useContactPage } from "../../hooks/contact/useContactPage.hook";
import { ContactView } from "../../components/contact/ContactView.component";

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
