import type {
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
} from "react-hook-form";
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
  trigger?: UseFormTrigger<LoginInput>;
}

export function LoginFormFields({
  register,
  errors,
  trigger,
}: LoginFormFieldsProps) {
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
          {...register("email", {
            onChange: () => {
              if (errors.email && trigger) {
                void trigger("email");
              }
            },
          })}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.password}
        htmlFor="password"
        required
        error={errors.password?.message}
        footerAction={
          <Link
            href={PATHS.forgotPassword}
            className="text-body-sm font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
          >
            {LABELS.forgotPassword}
          </Link>
        }
      >
        <PasswordInputContainer
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          {...register("password", {
            onChange: () => {
              if (errors.password && trigger) {
                void trigger("password");
              }
            },
          })}
        />
      </FormFieldFrame>
    </div>
  );
}
