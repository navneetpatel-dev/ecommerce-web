import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { TrackingLookupPage } from "@/features/orders";

export const metadata = generateNoIndexMetadata("Order Tracking");

export default function Tracking() {
  return <TrackingLookupPage />;
}
