import type { DataTableColumn } from "@/shared/types/data-table/types";

export type Item = { id: string; name: string; sku: string; price: string };

export const columns: DataTableColumn<Item>[] = [
  { id: "name", header: "Product Name", accessor: "name" },
  { id: "sku", header: "SKU Code", accessor: "sku" },
  { id: "price", header: "Price", accessor: "price" },
];

export const rows: Item[] = [
  { id: "1", name: "Keyboard", sku: "KB-01", price: "$50" },
  { id: "2", name: "Mouse", sku: "MS-02", price: "$25" },
];
