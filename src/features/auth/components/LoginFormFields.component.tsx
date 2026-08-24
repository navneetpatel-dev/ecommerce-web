import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LoginInput } from "../schemas/auth.schema";
import Link from "next/link";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { PasswordInputContainer } from "@/shared/containers/PasswordInputContainer.container";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
}

export function LoginFormFields({ register, errors }: LoginFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormFieldFrame
        label={LABELS.email}
        htmlFor="email"
        required
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          error={Boolean(errors.email)}
          {...register("email")}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.password}
        htmlFor="password"
        required
        error={errors.password?.message}
      >
        <PasswordInputContainer
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          {...register("password")}
        />
        <div className="flex justify-end pt-1">
          <Link
            href={PATHS.forgotPassword}
            className="text-body-sm font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
          >
            {LABELS.forgotPassword}
          </Link>
        </div>
      </FormFieldFrame>
    </div>
  );
}
