import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import type { Address } from "@/shared/api/types";

interface UserAddressesCardProps {
  addresses: Address[];
}

function renderAddressItem(address: Address) {
  const line2Element = address.line2 ? <p>{address.line2}</p> : null;
  return (
    <li key={address.id} className="text-body-sm text-ink">
      <p>{address.line1}</p>
      {line2Element}
      <p className="text-ink-muted">
        {address.city}, {address.state} {address.pincode}
      </p>
    </li>
  );
}

/** Addresses-on-file card for the admin user detail page. */
export function UserAddressesCard({ addresses }: UserAddressesCardProps) {
  const addressItems = addresses.map(renderAddressItem);
  const hasAddresses = addresses.length > 0;
  const addressesSection = hasAddresses ? (
    <ul className="space-y-3">{addressItems}</ul>
  ) : (
    <p className="text-body-sm text-ink-muted">
      {adminEntityDetailLabels.noAddressesOnFile}
    </p>
  );

  return (
    <section className="space-y-3 border border-line bg-surface-raised p-4">
      <h2 className="text-body-sm font-semibold uppercase tracking-wide text-ink-muted">
        {adminEntityDetailLabels.addressesOnFile}
      </h2>
      {addressesSection}
    </section>
  );
}
