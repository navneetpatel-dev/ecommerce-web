import { z } from "zod";
import type { CashbackOffer, CashbackOfferInput } from "@/features/cashback";

export const CASHBACK_PAYMENT_METHODS = ["RAZORPAY", "COD"] as const;

const optionalAmount = z
  .number({ error: "Enter an amount" })
  .positive("Must be more than 0")
  .optional();

export const CashbackOfferFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name the offer (at least 3 characters)")
      .max(120),
    percent: z
      .number({ error: "Enter a percentage" })
      .gt(0, "Must be more than 0")
      .max(100, "Cannot be more than 100"),
    maxCashback: optionalAmount,
    minOrderValue: z.number().min(0, "Cannot be negative"),
    categoryIds: z.array(z.string()),
    paymentMethods: z.array(z.enum(CASHBACK_PAYMENT_METHODS)),
    startsAt: z.string(),
    endsAt: z.string(),
    isActive: z.boolean(),
  })
  .refine(
    (values) =>
      !values.endsAt ||
      !values.startsAt ||
      new Date(values.endsAt) > new Date(values.startsAt),
    { message: "The end must be after the start", path: ["endsAt"] },
  );

export type CashbackOfferFormValues = z.infer<typeof CashbackOfferFormSchema>;

/** Form values for a new offer (starting now) or for editing a stored one. */
export function cashbackOfferToFormValues(
  offer: CashbackOffer | null,
): CashbackOfferFormValues {
  return {
    name: offer?.name ?? "",
    percent: offer?.percent ?? 5,
    maxCashback: offer?.maxCashback ?? undefined,
    minOrderValue: offer?.minOrderValue ?? 0,
    categoryIds: offer?.categoryIds ?? [],
    paymentMethods: offer?.paymentMethods ?? [],
    startsAt: offer?.startsAt ?? new Date().toISOString(),
    endsAt: offer?.endsAt ?? "",
    isActive: offer?.isActive ?? true,
  };
}

export function toCashbackOfferInput(
  values: CashbackOfferFormValues,
): CashbackOfferInput {
  return {
    name: values.name.trim(),
    percent: values.percent,
    maxCashback: values.maxCashback ?? null,
    minOrderValue: values.minOrderValue,
    categoryIds: values.categoryIds,
    paymentMethods: [...values.paymentMethods],
    startsAt: values.startsAt || undefined,
    endsAt: values.endsAt || null,
    isActive: values.isActive,
  };
}
