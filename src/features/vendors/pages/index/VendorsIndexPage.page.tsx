"use client";

import { useVendorsIndexPage } from "../../hooks/index/useVendorsIndexPage.hook";
import { VendorsIndexView } from "../../components/index/VendorsIndexView.component";

export function VendorsIndexPage() {
  const page = useVendorsIndexPage();

  return (
    <VendorsIndexView
      vendors={page.vendors}
      total={page.total}
      term={page.term}
      search={page.search}
      isLoading={page.isLoading}
      isEmpty={page.isEmpty}
      noMatches={page.noMatches}
      hasNextPage={page.hasNextPage}
      isFetchingNextPage={page.isFetchingNextPage}
      onTermChange={page.handleTermChange}
      onClearSearch={page.clearSearch}
      onLoadMore={page.loadMore}
    />
  );
}
