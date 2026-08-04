import { generateNoIndexMetadata } from '@/shared/seo/metadata'
import { VendorApprovalQueue } from '@/features/admin-dashboard/pages/VendorApprovalQueue'

export const metadata = generateNoIndexMetadata('Vendor Management')

export default function AdminVendors() {
  return <VendorApprovalQueue />
}
