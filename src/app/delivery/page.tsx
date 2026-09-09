import { redirect } from "next/navigation";
import { PATHS } from "@/shared/constants/paths/paths";
export default function DeliveryRoot() {
  redirect(PATHS.delivery.today);
}
