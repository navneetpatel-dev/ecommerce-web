import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorNewTicketPage } from "@/features/supportTickets";

export const metadata = generateNoIndexMetadata("New Support Ticket");

export default function VendorNewTicketRoute() {
  return <VendorNewTicketPage />;
}
