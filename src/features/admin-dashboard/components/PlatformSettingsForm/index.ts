// Barrel for the folder's subparts. The entry component lives beside
// this folder as "../PlatformSettingsForm.component" — do not re-export it here, it
// imports subparts from this barrel (would be a circular module).
export { CodSettingsSection } from "./CodSettingsSection.component";
export { CommerceSettingsSection } from "./CommerceSettingsSection.component";
export { FulfillmentSettingsSection } from "./FulfillmentSettingsSection.component";
export { PlatformSettingsHeader } from "./PlatformSettingsHeader.component";
export { SupportSettingsSection } from "./SupportSettingsSection.component";
