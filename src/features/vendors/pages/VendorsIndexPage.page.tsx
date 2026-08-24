"use client";

import { useVendorsIndexPage } from "../hooks/useVendorsIndexPage.hook";
import { VendorsIndexView } from "../components/VendorsIndexView.component";

export function VendorsIndexPage() {
  const page = useVendorsIndexPage();

  return (
    <VendorsIndexView
      vendors={page.vendors}
      isLoading={page.isLoading}
      isEmpty={page.isEmpty}
    />
  );
}
