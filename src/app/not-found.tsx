import type { Metadata } from "next";
import { StorefrontLayout } from "@/features/storefront";
import { NotFoundView } from "@/shared/components/system/NotFoundView.component";
import { LABELS } from "@/shared/constants/labels";

export const metadata: Metadata = {
  title: LABELS.pageNotFound,
  robots: { index: false, follow: false },
};

/** Root fallback for routes outside (storefront), and the proxy's real 404s. */
export default function NotFound() {
  return (
    <StorefrontLayout>
      <NotFoundView />
    </StorefrontLayout>
  );
}
