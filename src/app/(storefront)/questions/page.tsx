import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyQuestionsPage } from "@/features/productQna";
import { AuthGate } from "@/shared/components/system/AuthGate.component";

export const metadata = generateNoIndexMetadata("My questions");

export default function MyQuestionsRoute() {
  return (
    <AuthGate>
      <MyQuestionsPage />
    </AuthGate>
  );
}
