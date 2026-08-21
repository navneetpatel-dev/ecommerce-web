"use client";

import { Button } from "@/shared/components/ui/button";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_ATTRIBUTE_TYPE } from "@/shared/constants/statuses";

interface AttributeFormFieldsProps {
  name: string;
  onNameChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  options: string;
  onOptionsChange: (value: string) => void;
  editingId: string | null;
  error: string | null;
  loading: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function AttributeFormFields({
  name,
  onNameChange,
  type,
  onTypeChange,
  options,
  onOptionsChange,
  editingId,
  error,
  loading,
  onReset,
  onSave,
}: AttributeFormFieldsProps) {
  return (
    <FormSection
      title={LABELS.attributeFormSection}
      hint={LABELS.attributeFormSectionHint}
      columns={1}
      className="mt-4"
    >
      <FormFieldFrame label={LABELS.attributeName}>
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.attributeType}>
        <Select
          value={type}
          onValueChange={onTypeChange}
          disabled={Boolean(editingId)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CATEGORY_ATTRIBUTE_TYPE.ENUM}>
              {LABELS.attributeTypeEnum}
            </SelectItem>
            <SelectItem value={CATEGORY_ATTRIBUTE_TYPE.RANGE}>
              {LABELS.attributeTypeRange}
            </SelectItem>
            <SelectItem value={CATEGORY_ATTRIBUTE_TYPE.BOOLEAN}>
              {LABELS.attributeTypeBoolean}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      {type !== CATEGORY_ATTRIBUTE_TYPE.BOOLEAN ? (
        <FormFieldFrame label={LABELS.attributeOptions}>
          <Input
            value={options}
            onChange={(e) => onOptionsChange(e.target.value)}
          />
        </FormFieldFrame>
      ) : null}
      {error ? <p className="text-[0.8125rem] text-danger">{error}</p> : null}
      <FormActions>
        {editingId ? (
          <Button variant="secondary" disabled={loading} onClick={onReset}>
            {LABELS.cancelEditAttribute}
          </Button>
        ) : null}
        <Button disabled={loading || !name.trim()} onClick={onSave}>
          {editingId
            ? LABELS.saveCategoryAttribute
            : LABELS.addCategoryAttribute}
        </Button>
      </FormActions>
    </FormSection>
  );
}
