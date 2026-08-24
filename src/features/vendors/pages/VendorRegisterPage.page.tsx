"use client";

import { useVendorRegisterPage } from "../hooks/useVendorRegisterPage.hook";
import { VendorRegisterForm } from "../components/VendorRegisterForm";

export function VendorRegisterPage() {
  const page = useVendorRegisterPage();

  return (
    <VendorRegisterForm
      form={page.form}
      onSubmit={page.onSubmit}
      error={page.error}
      isPending={page.isPending}
    />
  );
}
