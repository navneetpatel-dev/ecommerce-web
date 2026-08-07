import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { WalletPage } from '@/features/wallet/pages/WalletPage'
import { LABELS } from '@/shared/constants/labels'

export const metadata = generateNoIndexMetadata(LABELS.wallet)

export default function WalletRoute() {
  return <WalletPage />
}
