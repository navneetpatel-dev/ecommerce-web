import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { MyReturnsPage } from "@/features/returns";

export const metadata = generateNoIndexMetadata("Returns");

export default function MyReturnsRoute() {
  return <MyReturnsPage />;
}
