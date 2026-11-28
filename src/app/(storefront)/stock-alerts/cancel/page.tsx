import { Suspense } from "react";
import { CancelStockAlertPage } from "@/features/content";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";

export const metadata = generateNoIndexMetadata(
  stockAlertsLabels.cancelHeading,
);

export default function CancelStockAlert() {
  return (
    <Suspense fallback={null}>
      <CancelStockAlertPage />
    </Suspense>
  );
}
