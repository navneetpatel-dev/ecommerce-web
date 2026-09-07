import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { WalletPage } from "@/features/wallet";
import { AuthGate } from "@/shared/components/AuthGate.component";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.wallet);

export default function WalletRoute() {
  return (
    <AuthGate>
      <WalletPage />
    </AuthGate>
  );
}
