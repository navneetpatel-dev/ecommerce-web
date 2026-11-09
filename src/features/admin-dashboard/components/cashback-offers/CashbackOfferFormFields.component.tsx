"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { CashbackOfferFormValues } from "../../schemas/cashback-offers/cashbackOfferForm.schema";
import { adminCashbackOffersStyles as styles } from "../../styles/cashback-offers/adminCashbackOffers.styles";
import {
  OfferActiveSwitch,
  OfferCategoriesField,
  OfferDateTimePicker,
  OfferNumberInput,
  OfferPaymentMethodField,
} from "./CashbackOfferControlledFields.component";

interface CashbackOfferFormFieldsProps {
  form: UseFormReturn<CashbackOfferFormValues>;
}

export function CashbackOfferFormFields({
  form,
}: CashbackOfferFormFieldsProps) {
  const errors = form.formState.errors;
  return (
    <div className={styles.form}>
      <FormFieldFrame
        label={LABELS.cashbackOfferName}
        htmlFor="cashback-offer-name"
        required
        error={errors.name?.message}
      >
        <Input
          id="cashback-offer-name"
          placeholder={LABELS.cashbackOfferNamePlaceholder}
          aria-invalid={Boolean(errors.name)}
          {...form.register("name")}
        />
      </FormFieldFrame>

      <div className={styles.grid}>
        <FormFieldFrame
          label={LABELS.cashbackOfferPercent}
          htmlFor="cashback-offer-percent"
          required
          error={errors.percent?.message}
        >
          <OfferNumberInput
            form={form}
            name="percent"
            id="cashback-offer-percent"
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            error={Boolean(errors.percent)}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.cashbackOfferMax}
          htmlFor="cashback-offer-max"
          hint={LABELS.cashbackOfferMaxHint}
          error={errors.maxCashback?.message}
        >
          <OfferNumberInput
            form={form}
            name="maxCashback"
            id="cashback-offer-max"
            min={0}
            error={Boolean(errors.maxCashback)}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.cashbackOfferMin}
          htmlFor="cashback-offer-min"
          error={errors.minOrderValue?.message}
        >
          <OfferNumberInput
            form={form}
            name="minOrderValue"
            id="cashback-offer-min"
            min={0}
            error={Boolean(errors.minOrderValue)}
          />
        </FormFieldFrame>
      </div>

      <FormFieldFrame
        label={LABELS.cashbackOfferCategories}
        hint={LABELS.cashbackOfferCategoriesHint}
      >
        <OfferCategoriesField form={form} />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.cashbackOfferPaymentMethods}
        hint={LABELS.cashbackOfferPaymentMethodsHint}
      >
        <div className={styles.checkboxRow}>
          <OfferPaymentMethodField
            form={form}
            method="RAZORPAY"
            label={LABELS.cashbackOfferPayOnline}
          />
          <OfferPaymentMethodField
            form={form}
            method="COD"
            label={LABELS.cashbackOfferPayCod}
          />
        </div>
      </FormFieldFrame>

      <div className={styles.gridTwo}>
        <FormFieldFrame
          label={LABELS.cashbackOfferStarts}
          htmlFor="cashback-offer-starts"
          error={errors.startsAt?.message}
        >
          <OfferDateTimePicker
            form={form}
            name="startsAt"
            id="cashback-offer-starts"
            error={Boolean(errors.startsAt)}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.cashbackOfferEnds}
          htmlFor="cashback-offer-ends"
          hint={LABELS.cashbackOfferEndsHint}
          error={errors.endsAt?.message}
        >
          <OfferDateTimePicker
            form={form}
            name="endsAt"
            id="cashback-offer-ends"
            error={Boolean(errors.endsAt)}
          />
        </FormFieldFrame>
      </div>

      <label htmlFor="cashback-offer-active" className={styles.switchRow}>
        <OfferActiveSwitch form={form} id="cashback-offer-active" />
        <span>{LABELS.cashbackOfferActive}</span>
      </label>
    </div>
  );
}
