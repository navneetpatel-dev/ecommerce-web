import { StatusBadge } from '@/shared/components/StatusBadge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  stock: number
  lowStockAt: number
  basePrice: number
  status: string
}

interface ProductsTableHeaderProps {
  search: string
  onSearchChange: (value: string) => void
}

export function ProductsTableHeader({ search, onSearchChange }: ProductsTableHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-[1.375rem] font-semibold text-ink">Products</h2>
        <Input
          placeholder="Search products..."
          className="w-64 text-[0.9375rem]"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button size="sm"><Plus className="h-4 w-4" /> Add Product</Button>
    </div>
  )
}

interface ProductRowProps {
  product: Product
}

export function ProductRow({ product }: ProductRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="font-mono text-[0.8125rem]">{product.sku}</TableCell>
      <TableCell>
        <span className={product.stock <= product.lowStockAt ? 'text-danger font-medium' : ''}>
          {product.stock}
        </span>
      </TableCell>
      <TableCell className="font-mono">₹{product.basePrice}</TableCell>
      <TableCell><StatusBadge status={product.status} /></TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

interface ProductsTableContentProps {
  products?: Product[]
}

export function ProductsTableContent({ products }: ProductsTableContentProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.length === 0 ? (
          <TableRow><TableCell colSpan={6} className="text-center text-ink-muted">No products found</TableCell></TableRow>
        ) : products?.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </TableBody>
    </Table>
  )
}
