import type { ProductDetail } from "@/shared/api/types";
import type { ProductWriteBody } from "../../schemas/listing-form/products.schema";

const asNumber = (value: unknown) =>
  value == null || value === "" ? null : Number(value);

/** Whether saving `body` over `product` changes price, MRP, tax code or COD (the API's pricing fields). */
export function pricingFieldsChanged(
  product: Pick<
    ProductDetail,
    "basePrice" | "compareAtPrice" | "hsnCode" | "codEnabled"
  >,
  body: Pick<
    ProductWriteBody,
    "basePrice" | "compareAtPrice" | "hsnCode" | "codEnabled"
  >,
): boolean {
  const text = (value: unknown) => (value == null ? "" : String(value).trim());
  return (
    asNumber(product.basePrice) !== asNumber(body.basePrice) ||
    asNumber(product.compareAtPrice) !== asNumber(body.compareAtPrice) ||
    text(product.hsnCode) !== text(body.hsnCode) ||
    (product.codEnabled ?? null) !== (body.codEnabled ?? null)
  );
}
