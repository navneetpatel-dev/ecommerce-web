interface Vendor {
  id: string;
  businessName: string;
}

interface VendorOptionsListProps {
  vendors?: Vendor[];
}

export function VendorOptionsList({ vendors }: VendorOptionsListProps) {
  if (!vendors || vendors.length === 0) return null;

  return (
    <>
      {vendors.map((v) => (
        <option key={v.id} value={v.id}>
          {v.businessName}
        </option>
      ))}
    </>
  );
}
