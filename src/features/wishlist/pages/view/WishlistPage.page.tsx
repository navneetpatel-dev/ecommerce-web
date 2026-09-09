"use client";

import { useWishlistPage } from "../../hooks/view/useWishlistPage.hook";
import { WishlistView } from "../../components/view/WishlistView.component";

export function WishlistPage() {
  const wishlist = useWishlistPage();

  return (
    <WishlistView
      isLoading={wishlist.isLoading}
      isEmpty={wishlist.isEmpty}
      items={wishlist.items}
      pagination={wishlist.pagination}
      removeError={wishlist.removeError}
      onRemoveItem={wishlist.removeItem}
    />
  );
}
