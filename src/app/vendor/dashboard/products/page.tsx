import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { ProductsTable } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Products");

export default function VendorProducts() {
  return <ProductsTable />;
}
