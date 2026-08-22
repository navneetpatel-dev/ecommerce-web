import { StorefrontLayout } from "@/features/storefront";

export default function StorefrontRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontLayout>{children}</StorefrontLayout>;
}
