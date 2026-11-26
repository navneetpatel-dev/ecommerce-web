import type { AdminPlatformSettings } from "../../api/settings/settings.api";

function roundRate(value: number | undefined, fallback: number): number {
  const num = Number(value ?? fallback);
  return Number.isFinite(num) ? Number(num.toFixed(4)) : fallback;
}

/** The settings as the form edits them: every optional field filled with its documented default. */
export function normalizeLoadedSettings(
  settings: AdminPlatformSettings,
): AdminPlatformSettings {
  return {
    ...settings,
    defaultCommissionRate: roundRate(settings.defaultCommissionRate, 10),
    tcsRatePercent: roundRate(settings.tcsRatePercent, 0.5),
    tdsRatePercent: roundRate(settings.tdsRatePercent, 0.1),
    payoutCycle: (settings.payoutCycle || "WEEKLY").toUpperCase(),
    autoApproveReviews: settings.autoApproveReviews !== false,
    autoApproveQuestions: settings.autoApproveQuestions !== false,
    returnShippingFee: settings.returnShippingFee ?? 0,
    tds194oExemptionThreshold: settings.tds194oExemptionThreshold ?? 500000,
    commissionGstRatePercent: roundRate(settings.commissionGstRatePercent, 18),
    platformGstin: settings.platformGstin ?? "",
    platformLegalName: settings.platformLegalName ?? "",
    platformState: settings.platformState ?? "",
    codEnabled: settings.codEnabled !== false,
    codMinOrderValue: settings.codMinOrderValue ?? 0,
    codMaxOrderValue: settings.codMaxOrderValue ?? null,
    walletRechargeEnabled: settings.walletRechargeEnabled !== false,
    walletMinRechargeInr: settings.walletMinRechargeInr ?? 1,
    walletMaxRechargeInr: settings.walletMaxRechargeInr ?? 10000,
    walletMaxBalancePoints: settings.walletMaxBalancePoints ?? 50000,
    walletRechargePresetsInr: settings.walletRechargePresetsInr ?? [
      500, 1000, 2000, 5000,
    ],
    promotionalPointsTtlDays: settings.promotionalPointsTtlDays ?? 0,
    refundSlaBusinessDays: settings.refundSlaBusinessDays ?? 7,
    scheduledReportsEnabled: settings.scheduledReportsEnabled ?? false,
    scheduledReportsTypes: settings.scheduledReportsTypes ?? [],
    scheduledReportsRecipients: settings.scheduledReportsRecipients ?? [],
    scheduledReportsDayOfWeek: settings.scheduledReportsDayOfWeek ?? 1,
    scheduledReportsHourUtc: settings.scheduledReportsHourUtc ?? 6,
    maintenanceEnabled: settings.maintenanceEnabled ?? false,
    maintenanceMessage: settings.maintenanceMessage ?? "",
    maintenanceUntil: settings.maintenanceUntil ?? null,
    welcomeOfferEnabled: settings.welcomeOfferEnabled !== false,
    welcomeOfferPercent: settings.welcomeOfferPercent ?? 10,
    welcomeOfferMaxDiscount: settings.welcomeOfferMaxDiscount ?? 200,
    welcomeOfferMinOrder: settings.welcomeOfferMinOrder ?? 0,
    welcomeOfferValidDays: settings.welcomeOfferValidDays ?? 30,
  };
}
