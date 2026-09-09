"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { VendorReviewsView } from "../../components/reviews/VendorReviewsView.component";
import { useVendorReviewsPage } from "../../hooks/reviews/useVendorReviewsPage.hook";

export function VendorReviewsPage() {
  const { reviews, isLoading, loadError, submitting, handleRespond } =
    useVendorReviewsPage();

  return (
    <RequirePermission permission={PERMISSIONS.REVIEW_RESPOND}>
      <VendorReviewsView
        reviews={reviews}
        isLoading={isLoading}
        loadError={loadError}
        submitting={submitting}
        onRespond={handleRespond}
      />
    </RequirePermission>
  );
}
