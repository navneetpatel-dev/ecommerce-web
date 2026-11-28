import type {
  VendorBankDetails,
  VendorPayoutFrequency,
} from "../../../api/overview/vendor.api";
import { LABELS } from "@/shared/constants/labels";
import type { VendorEntityType } from "@/shared/constants/statuses";

export interface ShopSettingsSaveOverride {
  returnShippingFee?: number | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  entityType?: VendorEntityType | null;
  categoryIds?: string[];
  codEnabled?: boolean;
  payoutFrequency?: VendorPayoutFrequency | null;
  bankDetails?: VendorBankDetails | null;
}

export interface ShopSettingsSnapshot {
  entityType: VendorEntityType | null;
  categoryIds: string[];
  returnShippingFee: number | null;
  codEnabled: boolean;
  payoutFrequency: VendorPayoutFrequency | null;
  bankDetails?: VendorBankDetails | null;
  /** Account number as last saved; an edit to it must be re-typed to confirm. */
  savedAccountNumber: string;
  confirmAccountNumber: string;
  logoUrl: string | null;
  bannerUrl: string | null;
}

const ACCOUNT_NUMBER = /^\d{9,18}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/i;

/** Why the bank details cannot be saved yet, or null. Untouched details are never blocked. */
export function bankDetailsProblem(shop: ShopSettingsSnapshot): string | null {
  const number = shop.bankDetails?.accountNumber ?? "";
  if (number !== shop.savedAccountNumber) {
    if (!ACCOUNT_NUMBER.test(number)) return LABELS.bankAccountNumberInvalid;
    if (number !== shop.confirmAccountNumber)
      return LABELS.bankAccountNumbersMismatch;
  }
  const ifsc = shop.bankDetails?.ifscCode ?? "";
  if (ifsc && !IFSC.test(ifsc)) return LABELS.bankIfscInvalid;
  return null;
}

const has = (override: ShopSettingsSaveOverride | undefined, key: string) =>
  Boolean(override) && key in (override as object);

/**
 * The PATCH /vendors/me body.
 *
 * A `partial` save (a logo upload, a category change, clearing the return fee) sends only
 * what the override names, so an unrelated half-edited field — a new bank account being
 * typed — is never saved along with it. A full save sends the whole form.
 */
export function buildShopSettingsPayload(
  shop: ShopSettingsSnapshot,
  override: ShopSettingsSaveOverride | undefined,
  partial: boolean,
): Record<string, unknown> {
  const pick = <K extends keyof ShopSettingsSaveOverride>(
    key: K,
    current: ShopSettingsSaveOverride[K],
  ) => (override && key in override ? override[key] : current);
  const categoryIds = pick("categoryIds", shop.categoryIds);
  const entityType = pick("entityType", shop.entityType);
  const categories =
    categoryIds && categoryIds.length > 0 ? { categoryIds } : {};

  if (partial) {
    const payload: Record<string, unknown> = {};
    if (has(override, "logoUrl")) payload.logoUrl = override?.logoUrl;
    if (has(override, "bannerUrl")) payload.bannerUrl = override?.bannerUrl;
    if (has(override, "categoryIds")) Object.assign(payload, categories);
    for (const key of [
      "returnShippingFee",
      "codEnabled",
      "payoutFrequency",
    ] as const) {
      if (has(override, key)) payload[key] = override?.[key];
    }
    if (has(override, "entityType") && entityType)
      payload.entityType = entityType;
    return payload;
  }

  const payload: Record<string, unknown> = {
    logoUrl: pick("logoUrl", shop.logoUrl),
    bannerUrl: pick("bannerUrl", shop.bannerUrl),
    ...categories,
  };
  payload.returnShippingFee = pick("returnShippingFee", shop.returnShippingFee);
  payload.codEnabled = pick("codEnabled", shop.codEnabled);
  payload.payoutFrequency = pick("payoutFrequency", shop.payoutFrequency);
  if (entityType) payload.entityType = entityType;
  const bank = pick("bankDetails", shop.bankDetails);
  if (bank !== undefined) payload.bankDetails = bank;
  return payload;
}
