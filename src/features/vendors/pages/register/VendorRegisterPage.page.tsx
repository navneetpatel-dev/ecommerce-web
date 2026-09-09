"use client";

import { useVendorRegisterPage } from "../../hooks/register/useVendorRegisterPage.hook";
import { VendorRegisterForm } from "../../components/register/VendorRegisterForm/index";

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
