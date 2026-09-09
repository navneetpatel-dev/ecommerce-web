import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { navigate } from "@/shared/utils/navigate";
import type { LoginInput } from "../../schemas/auth.schema";

interface UseLoginCardParams {
  form: UseFormReturn<LoginInput>;
  onSubmit: (data: LoginInput) => void;
  oauthRedirect?: string | null;
}

export function useLoginCard({
  form,
  onSubmit,
  oauthRedirect,
}: UseLoginCardParams) {
  const router = useRouter();
  const {
    handleSubmit,
    trigger,
    getValues,
    setFocus,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const handleUseEmailCode = async () => {
    clearErrors("password");
    const rawEmail = getValues("email")?.trim() ?? "";
    if (!rawEmail) {
      setError("email", {
        type: "manual",
        message: LABELS.emailRequired,
      });
      setFocus("email");
      return;
    }

    const isValid = await trigger("email");
    if (!isValid) {
      setFocus("email");
      return;
    }

    navigate(router, PATHS.otpForEmail(rawEmail, oauthRedirect));
  };

  const onFormSubmit = handleSubmit(onSubmit);

  return {
    errors,
    handleUseEmailCode,
    onFormSubmit,
  };
}
