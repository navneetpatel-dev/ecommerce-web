import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormError } from "@/shared/components/FormError.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AskQuestionFormInput } from "../schemas/productQna.schema";

interface AskQuestionFormProps {
  register: UseFormRegister<AskQuestionFormInput>;
  errors: FieldErrors<AskQuestionFormInput>;
  question: string;
  isPending: boolean;
  isSuccess: boolean;
  formLevelError?: string | null;
  onSubmit: (event: React.FormEvent) => void;
}

export function AskQuestionForm({
  register,
  errors,
  question,
  isPending,
  isSuccess,
  formLevelError = null,
  onSubmit,
}: AskQuestionFormProps) {
  const canSubmit = question.trim().length >= 3;

  return (
    <form onSubmit={onSubmit} className="max-w-lg">
      <FormStack>
        <FormSection
          title={LABELS.askAQuestion}
          hint={LABELS.askAQuestionHint}
          columns={1}
        >
          <FormFieldFrame
            label={LABELS.yourQuestion}
            htmlFor="question"
            error={errors.question?.message}
          >
            <Textarea
              id="question"
              error={Boolean(errors.question?.message)}
              {...register("question")}
              placeholder={LABELS.questionPlaceholder}
              rows={3}
            />
          </FormFieldFrame>
        </FormSection>

        <FormError
          error={formLevelError}
          fallback={LABELS.couldNotSubmitQuestion}
        />

        {isSuccess ? (
          <p className="text-body-sm text-success">
            {LABELS.questionSubmittedForReview}
          </p>
        ) : null}

        <FormActions>
          <DisabledActionHint
            disabled={!canSubmit}
            message={LABELS.enterYourQuestion}
          >
            <Button
              type="submit"
              loading={isPending}
              disabled={!canSubmit || isPending}
            >
              {LABELS.submitQuestion}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
