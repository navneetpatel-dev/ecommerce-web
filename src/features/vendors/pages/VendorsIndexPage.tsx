'use client'

import { useVendorsIndexPage } from '../hooks/useVendorsIndexPage'
import { VendorsIndexView } from '../components/VendorsIndexView'

export function VendorsIndexPage() {
  const page = useVendorsIndexPage()

  return (
    <VendorsIndexView
      vendors={page.vendors}
      isLoading={page.isLoading}
      isEmpty={page.isEmpty}
    />
  )
}
