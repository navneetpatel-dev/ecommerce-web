import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { CashbackHistoryPage } from "@/features/cashback";
import { AuthGate } from "@/shared/components/system/AuthGate.component";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.cashbackPageTitle);

export default function CashbackRoute() {
  return (
    <AuthGate>
      <CashbackHistoryPage />
    </AuthGate>
  );
}
