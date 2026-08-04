import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { WalletPage } from '@/features/wallet/pages/WalletPage'

export const metadata = generateNoIndexMetadata('Wallet')

export default function Wallet() {
  return <WalletPage />
}
