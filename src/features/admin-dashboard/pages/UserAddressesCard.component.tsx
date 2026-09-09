import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import type { Address } from "@/shared/api/types";
import { userAddressesCardStyles } from "./adminUserDetail.styles";

interface UserAddressesCardProps {
  addresses: Address[];
}

function renderAddressItem(address: Address) {
  const line2Element = address.line2 ? <p>{address.line2}</p> : null;
  return (
    <li key={address.id} className={userAddressesCardStyles.addressItem}>
      <p>{address.line1}</p>
      {line2Element}
      <p className={userAddressesCardStyles.addressMeta}>
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
    <ul className={userAddressesCardStyles.list}>{addressItems}</ul>
  ) : (
    <p className={userAddressesCardStyles.empty}>
      {adminEntityDetailLabels.noAddressesOnFile}
    </p>
  );

  return (
    <section className={userAddressesCardStyles.section}>
      <h2 className={userAddressesCardStyles.title}>
        {adminEntityDetailLabels.addressesOnFile}
      </h2>
      {addressesSection}
    </section>
  );
}
