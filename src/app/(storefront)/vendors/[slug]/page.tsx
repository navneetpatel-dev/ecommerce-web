import { VendorStorefrontPage } from "@/features/vendors";

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  return <VendorStorefrontPage slug={slug} />;
}
