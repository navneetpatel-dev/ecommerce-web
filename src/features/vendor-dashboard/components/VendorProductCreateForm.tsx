"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/FileUpload";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/NumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { useManualFormFieldErrors } from "@/shared/hooks/useManualFormFieldErrors";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";
import { PRODUCT_FIELD_LIMITS } from "@/features/products";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import {
  emptySpecRow,
  parseProductListingForm,
  productFormFieldErrors,
  toProductWriteBody,
  type ProductCodMode,
  type ProductListingFormField,
  type ProductListingFormValues,
  type ProductWriteBody,
} from "@/features/products";

interface VendorProductCreateFormProps {
  mode: "create" | "edit";
  values: ProductListingFormValues;
  categories: Array<{ id: string; name: string }>;
  imageUrls: string[];
  draftUploadId: string;
  submitError: string | null;
  submitting: boolean;
  loading?: boolean;
  onChange: (patch: Partial<ProductListingFormValues>) => void;
  onImageUrlsChange: (urls: string[]) => void;
  onValidSubmit: (body: ProductWriteBody) => void;
  onCancel: () => void;
}

export function VendorProductCreateForm({
  mode,
  values,
  categories,
  imageUrls,
  draftUploadId,
  submitError,
  submitting,
  loading = false,
  onChange,
  onImageUrlsChange,
  onValidSubmit,
  onCancel,
}: VendorProductCreateFormProps) {
  const { clearAll, clearField, setErrors, getError } =
    useManualFormFieldErrors<ProductListingFormField>();
  const disabled = submitting || loading;
  const showImages = mode === "create";

  const requiredChecks = [
    { ok: Boolean(values.name.trim()), message: LABELS.enterProductName },
    {
      ok: values.price !== "" && Number(values.price) >= 1,
      message: LABELS.enterProductPrice,
    },
    { ok: Boolean(values.categoryId), message: LABELS.selectProductCategory },
    {
      ok: Boolean(values.description.trim()),
      message: LABELS.enterProductDescription,
    },
  ];
  const canSubmit = allRequiredFieldsMet(requiredChecks) && !loading;
  const disableHint = loading
    ? LABELS.loading
    : (firstMissingRequiredHint(requiredChecks) ?? "");

  const patchValues = (patch: Partial<ProductListingFormValues>) => {
    for (const key of Object.keys(patch) as ProductListingFormField[]) {
      clearField(key);
    }
    onChange(patch);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearAll();
    const parsed = parseProductListingForm(values);
    if (!parsed.success) {
      setErrors(productFormFieldErrors(parsed.error));
      return;
    }
    onValidSubmit(toProductWriteBody(parsed.data));
  };

  const highlightsAtMax =
    values.highlights.length >= PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX;
  const specsAtMax = values.specs.length >= PRODUCT_FIELD_LIMITS.SPECS_MAX;

  return (
    <form className="mb-5" onSubmit={handleSubmit}>
      <FormStack>
        <FormSection
          title={LABELS.productFormSectionDetails}
          hint={LABELS.productFormSectionDetailsHint}
        >
          <FormFieldFrame
            label={LABELS.productName}
            required
            error={getError("name")}
          >
            <Input
              placeholder={LABELS.productNamePlaceholder}
              value={values.name}
              maxLength={PRODUCT_FIELD_LIMITS.NAME_MAX}
              error={Boolean(getError("name"))}
              disabled={disabled}
              onChange={(event) => patchValues({ name: event.target.value })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.pricePlaceholder}
            required
            error={getError("price")}
          >
            <NumberInput
              prefix="₹"
              min={1}
              step={1}
              placeholder={LABELS.pricePlaceholder}
              value={values.price === "" ? undefined : Number(values.price)}
              error={Boolean(getError("price"))}
              disabled={disabled}
              onChange={(value) =>
                patchValues({ price: value == null ? "" : String(value) })
              }
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.listPrice}
            hint={LABELS.productMrpHint}
            error={getError("compareAtPrice")}
          >
            <NumberInput
              prefix="₹"
              min={1}
              step={1}
              placeholder={LABELS.listPrice}
              value={
                values.compareAtPrice === ""
                  ? undefined
                  : Number(values.compareAtPrice)
              }
              error={Boolean(getError("compareAtPrice"))}
              disabled={disabled}
              onChange={(value) =>
                patchValues({
                  compareAtPrice: value == null ? "" : String(value),
                })
              }
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.productBrand} error={getError("brand")}>
            <Input
              placeholder={LABELS.productBrandPlaceholder}
              value={values.brand}
              maxLength={PRODUCT_FIELD_LIMITS.BRAND_MAX}
              error={Boolean(getError("brand"))}
              disabled={disabled}
              onChange={(event) => patchValues({ brand: event.target.value })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.selectCategory}
            required
            error={getError("categoryId")}
            className="sm:col-span-2"
          >
            <Select
              value={values.categoryId || undefined}
              onValueChange={(value) => patchValues({ categoryId: value })}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(getError("categoryId") && "border-danger")}
              >
                <SelectValue placeholder={LABELS.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.shortDescription}
            required
            error={getError("description")}
            className="sm:col-span-2"
          >
            <Textarea
              placeholder={LABELS.shortDescription}
              value={values.description}
              maxLength={PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX}
              error={Boolean(getError("description"))}
              disabled={disabled}
              onChange={(event) =>
                patchValues({ description: event.target.value })
              }
              className="min-h-[6.5rem]"
            />
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.productFormSectionCatalog}
          hint={LABELS.productFormSectionCatalogHint}
          columns={1}
        >
          <FormFieldFrame
            label={LABELS.productTags}
            hint={LABELS.productTagsHint}
            error={getError("tagsInput")}
          >
            <Input
              placeholder={LABELS.productTagsPlaceholder}
              value={values.tagsInput}
              error={Boolean(getError("tagsInput"))}
              disabled={disabled}
              onChange={(event) =>
                patchValues({ tagsInput: event.target.value })
              }
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.productHighlights}
            error={getError("highlights")}
          >
            <div className="space-y-2">
              {values.highlights.map((item, index) => (
                <div key={`highlight-${index}`} className="flex gap-2">
                  <Input
                    value={item}
                    maxLength={PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX}
                    error={Boolean(getError("highlights"))}
                    disabled={disabled}
                    onChange={(event) => {
                      const highlights = [...values.highlights];
                      highlights[index] = event.target.value;
                      patchValues({ highlights });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    onClick={() =>
                      patchValues({
                        highlights: values.highlights.filter(
                          (_, rowIndex) => rowIndex !== index,
                        ),
                      })
                    }
                    aria-label={formatLabel(LABELS.removeNamed, {
                      name: LABELS.productHighlights,
                    })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                disabled={disabled || highlightsAtMax}
                onClick={() =>
                  patchValues({ highlights: [...values.highlights, ""] })
                }
              >
                <Plus aria-hidden />
                {LABELS.addProductHighlight}
              </Button>
            </div>
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.specifications}
            error={getError("specs")}
          >
            <div className="space-y-2">
              {values.specs.map((row, index) => (
                <div
                  key={`spec-${index}`}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Input
                    placeholder={LABELS.productSpecKey}
                    value={row.key}
                    maxLength={PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX}
                    error={Boolean(getError("specs"))}
                    disabled={disabled}
                    onChange={(event) => {
                      const specs = values.specs.map((current, rowIndex) =>
                        rowIndex === index
                          ? { ...current, key: event.target.value }
                          : current,
                      );
                      patchValues({ specs });
                    }}
                  />
                  <Input
                    placeholder={LABELS.productSpecValue}
                    value={row.value}
                    maxLength={PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX}
                    error={Boolean(getError("specs"))}
                    disabled={disabled}
                    onChange={(event) => {
                      const specs = values.specs.map((current, rowIndex) =>
                        rowIndex === index
                          ? { ...current, value: event.target.value }
                          : current,
                      );
                      patchValues({ specs });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    onClick={() =>
                      patchValues({
                        specs: values.specs.filter(
                          (_, rowIndex) => rowIndex !== index,
                        ),
                      })
                    }
                    aria-label={formatLabel(LABELS.removeNamed, {
                      name: LABELS.specifications,
                    })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                disabled={disabled || specsAtMax}
                onClick={() =>
                  patchValues({ specs: [...values.specs, emptySpecRow()] })
                }
              >
                <Plus aria-hidden />
                {LABELS.addProductSpecification}
              </Button>
            </div>
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.productFormSectionPolicies}
          hint={LABELS.productFormSectionPoliciesHint}
        >
          <FormFieldFrame
            label={LABELS.productDeliveryNote}
            hint={LABELS.productDeliveryNoteHint}
            error={getError("deliveryNote")}
          >
            <Textarea
              value={values.deliveryNote}
              maxLength={PRODUCT_FIELD_LIMITS.NOTE_MAX}
              error={Boolean(getError("deliveryNote"))}
              disabled={disabled}
              onChange={(event) =>
                patchValues({ deliveryNote: event.target.value })
              }
              className="min-h-[5.5rem]"
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productReturnNote}
            hint={LABELS.productReturnNoteHint}
            error={getError("returnNote")}
          >
            <Textarea
              value={values.returnNote}
              maxLength={PRODUCT_FIELD_LIMITS.NOTE_MAX}
              error={Boolean(getError("returnNote"))}
              disabled={disabled}
              onChange={(event) =>
                patchValues({ returnNote: event.target.value })
              }
              className="min-h-[5.5rem]"
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productWarrantyMonths}
            hint={LABELS.productWarrantyMonthsHint}
            error={getError("warrantyMonths")}
          >
            <NumberInput
              value={
                values.warrantyMonths === ""
                  ? undefined
                  : Number(values.warrantyMonths)
              }
              min={0}
              max={PRODUCT_FIELD_LIMITS.WARRANTY_MONTHS_MAX}
              step={1}
              disabled={disabled}
              onChange={(value) =>
                patchValues({
                  warrantyMonths: value == null ? "" : String(value),
                })
              }
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productWarrantyType}
            error={getError("warrantyType")}
          >
            <Select
              value={values.warrantyType || "__inherit__"}
              onValueChange={(value) =>
                patchValues({
                  warrantyType: value === "__inherit__" ? "" : value,
                })
              }
            >
              <SelectTrigger disabled={disabled}>
                <SelectValue placeholder={LABELS.inheritDefault} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__inherit__">
                  {LABELS.inheritDefault}
                </SelectItem>
                <SelectItem value={WARRANTY_TYPE.MANUFACTURER}>
                  {LABELS.warrantyManufacturer}
                </SelectItem>
                <SelectItem value={WARRANTY_TYPE.SELLER}>
                  {LABELS.warrantySeller}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productHsnCode}
            hint={LABELS.productHsnCodeHint}
            error={getError("hsnCode")}
          >
            <Input
              value={values.hsnCode}
              maxLength={PRODUCT_FIELD_LIMITS.HSN_MAX}
              error={Boolean(getError("hsnCode"))}
              disabled={disabled}
              onChange={(event) => patchValues({ hsnCode: event.target.value })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productCodEnabled}
            error={getError("codMode")}
          >
            <Select
              value={values.codMode}
              onValueChange={(value) =>
                patchValues({ codMode: value as ProductCodMode })
              }
            >
              <SelectTrigger disabled={disabled}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">
                  {LABELS.productCodInherit}
                </SelectItem>
                <SelectItem value="on">{LABELS.productCodOn}</SelectItem>
                <SelectItem value="off">{LABELS.productCodOff}</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.productFormSectionMedia}
          hint={LABELS.productFormSectionMediaHint}
          columns={1}
        >
          <FormFieldFrame
            label={LABELS.productVideoUrl}
            error={getError("videoUrl")}
          >
            <FileUpload
              entityType={UPLOAD_ENTITY.PRODUCTS}
              entityId={draftUploadId}
              purpose={UPLOAD_PURPOSE.VIDEO}
              valueUrl={values.videoUrl || null}
              onUploaded={(url) => patchValues({ videoUrl: url })}
              disabled={disabled}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productSizeChart}
            error={getError("sizeChartUrl")}
          >
            <FileUpload
              entityType={UPLOAD_ENTITY.PRODUCTS}
              entityId={draftUploadId}
              purpose={UPLOAD_PURPOSE.SIZE_CHART}
              valueUrl={values.sizeChartUrl || null}
              onUploaded={(url) => patchValues({ sizeChartUrl: url })}
              disabled={disabled}
            />
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.productFormSectionSeo}
          hint={LABELS.productFormSectionSeoHint}
        >
          <FormFieldFrame
            label={LABELS.productSeoTitle}
            error={getError("seoTitle")}
          >
            <Input
              value={values.seoTitle}
              maxLength={PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX}
              error={Boolean(getError("seoTitle"))}
              disabled={disabled}
              onChange={(event) =>
                patchValues({ seoTitle: event.target.value })
              }
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.productSeoDescription}
            error={getError("seoDescription")}
          >
            <Textarea
              value={values.seoDescription}
              maxLength={PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX}
              error={Boolean(getError("seoDescription"))}
              disabled={disabled}
              onChange={(event) =>
                patchValues({ seoDescription: event.target.value })
              }
              className="min-h-[5.5rem]"
            />
          </FormFieldFrame>
        </FormSection>

        {showImages ? (
          <FormSection
            title={LABELS.productFormSectionImages}
            hint={LABELS.productFormSectionImagesHint}
            columns={1}
          >
            <FileUpload
              mode="multiple"
              entityType={UPLOAD_ENTITY.PRODUCTS}
              entityId={draftUploadId}
              purpose={UPLOAD_PURPOSE.IMAGES}
              accept="image/png,image/jpeg,image/webp"
              valueUrls={imageUrls}
              onUploaded={onImageUrlsChange}
              label={LABELS.productImagesLabel}
              disabled={disabled}
            />
          </FormSection>
        ) : null}

        {submitError ? (
          <p className="text-sm text-danger">{submitError}</p>
        ) : null}

        <FormActions>
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            {LABELS.cancel}
          </Button>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              disabled={!canSubmit || disabled}
              loading={submitting}
            >
              {mode === "edit"
                ? submitting
                  ? LABELS.updatingEllipsis
                  : LABELS.saveChanges
                : submitting
                  ? LABELS.creatingEllipsis
                  : LABELS.createProduct}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
