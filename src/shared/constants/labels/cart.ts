/** Customer cart copy. Subset of LABELS; merged in labels/index.ts. */
export const cartLabels = {
  clearAll: "Clear all",
  clearCartTitle: "Clear your cart?",
  clearCartDescription:
    "This will remove every item from your cart. This action cannot be undone.",
  removeCartItemTitle: "Remove this item?",
  removeCartItemDescription:
    "Remove “{name}” from your cart? You can add it again later.",
  cartUpdatingActionHint: "Please wait while your cart updates.",
  couldNotAddToCart:
    "We couldn't add this item to your cart. Check your connection and try again.",
  couldNotUpdateCart:
    "We couldn't update this quantity. Your previous quantity has been restored. Check your connection and try again.",
  couldNotRemoveCartItem:
    "We couldn't remove this item. It has been restored to your cart. Check your connection and try again.",
  couldNotClearCart:
    "We couldn't clear your cart. Your items have been restored. Check your connection and try again.",
} as const;
