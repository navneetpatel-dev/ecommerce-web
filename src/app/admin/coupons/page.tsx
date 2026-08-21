import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AdminCouponsPage } from "@/features/admin-dashboard";

export const metadata = generateNoIndexMetadata("Coupons");

export default function AdminCoupons() {
  return <AdminCouponsPage />;
}
