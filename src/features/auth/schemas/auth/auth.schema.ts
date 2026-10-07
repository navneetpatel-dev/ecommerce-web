import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { phoneField } from "@/shared/schemas/phone.schema";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, LABELS.emailRequired)
    .email(LABELS.invalidEmail),
  password: z.string().min(1, LABELS.passwordRequired),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, LABELS.emailRequired)
    .email(LABELS.invalidEmail),
  password: z.string().min(8, LABELS.passwordMinLength),
  name: z.string().min(1, LABELS.nameRequired),
  phone: phoneField,
  acceptTerms: z
    .boolean()
    .refine((value) => value, LABELS.agreeToTermsRequired),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, LABELS.emailRequired)
    .email(LABELS.invalidEmail),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, LABELS.passwordMinLength),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, LABELS.passwordMinLength),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
