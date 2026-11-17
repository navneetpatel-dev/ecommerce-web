import { SelectItem } from "@/shared/components/ui/select";
import { CONTACT_TOPICS } from "../../constants/contact/contactTopics";

/** The topic choices of the contact form. */
export function ContactTopicOptions() {
  return CONTACT_TOPICS.map((topic) => (
    <SelectItem key={topic.value} value={topic.value}>
      {topic.label}
    </SelectItem>
  ));
}
