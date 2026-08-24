import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyReturnDetailPage } from "@/features/returns";

export const metadata = generateNoIndexMetadata("Return");

export default function MyReturnDetailRoute() {
  return <MyReturnDetailPage />;
}
