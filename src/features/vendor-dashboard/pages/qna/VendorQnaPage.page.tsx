"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { VendorQnaView } from "../../components/qna/VendorQnaView.component";
import { useVendorQnaPage } from "../../hooks/qna/useVendorQnaPage.hook";

export function VendorQnaPage() {
  const { questions, isLoading, loadError, submitting, handleAnswer } =
    useVendorQnaPage();

  return (
    <RequirePermission permission={PERMISSIONS.REVIEW_RESPOND}>
      <VendorQnaView
        questions={questions}
        isLoading={isLoading}
        loadError={loadError}
        submitting={submitting}
        onAnswer={handleAnswer}
      />
    </RequirePermission>
  );
}
