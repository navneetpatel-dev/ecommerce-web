"use client";

import { useVendorsIndexPage } from "../../hooks/index/useVendorsIndexPage.hook";
import { VendorsIndexView } from "../../components/index/VendorsIndexView.component";

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
