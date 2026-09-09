"use client";

import type { ChangeEvent } from "react";
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
import { adminCategoryAttributesActionStyles as styles } from "../../../styles/categories/adminCategoryAttributesAction.styles";

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
  const isEditing = Boolean(editingId);
  const isBooleanType = type === CATEGORY_ATTRIBUTE_TYPE.BOOLEAN;
  const nameIsBlank = !name.trim();
  const saveDisabled = loading || nameIsBlank;
  const saveLabel = isEditing
    ? LABELS.saveCategoryAttribute
    : LABELS.addCategoryAttribute;

  const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  const handleOptionsInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange(e.target.value);
  };

  const optionsField = isBooleanType ? null : (
    <FormFieldFrame label={LABELS.attributeOptions}>
      <Input value={options} onChange={handleOptionsInputChange} />
    </FormFieldFrame>
  );

  const errorMessage = error ? (
    <p className={styles.errorMessage}>{error}</p>
  ) : null;

  const cancelButton = isEditing ? (
    <Button variant="secondary" disabled={loading} onClick={onReset}>
      {LABELS.cancelEditAttribute}
    </Button>
  ) : null;

  return (
    <FormSection
      title={LABELS.attributeFormSection}
      hint={LABELS.attributeFormSectionHint}
      columns={1}
      className={styles.formSection}
    >
      <FormFieldFrame label={LABELS.attributeName}>
        <Input value={name} onChange={handleNameInputChange} />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.attributeType}>
        <Select value={type} onValueChange={onTypeChange} disabled={isEditing}>
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
      {optionsField}
      {errorMessage}
      <FormActions>
        {cancelButton}
        <Button disabled={saveDisabled} onClick={onSave}>
          {saveLabel}
        </Button>
      </FormActions>
    </FormSection>
  );
}
