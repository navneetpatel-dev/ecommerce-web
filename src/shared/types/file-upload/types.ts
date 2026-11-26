import type { ImageMimeType } from "@/shared/constants/imageSpecs";
import type {
  UploadEntityType,
  UploadPurpose,
} from "@/shared/constants/uploads/uploads";

export type PreviewEntry = { storedUrl: string; displayUrl: string };

/** Opt-in look and behaviour shared by both modes. Without them the uploader is the compact one. */
type CardOptions = {
  /** `card`: a roomy bordered panel with large previews. */
  variant?: "inline" | "card";
  /** Each preview gets a Remove button (single mode clears the value to ""). */
  removable?: boolean;
};

type SingleProps = CardOptions & {
  mode?: "single";
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
  accept?: string;
  maxBytes?: number;
  disabled?: boolean;
  valueUrl?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
};

type MultiProps = CardOptions & {
  mode: "multiple";
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
  accept?: string;
  maxBytes?: number;
  disabled?: boolean;
  valueUrls?: string[];
  onUploaded: (urls: string[]) => void;
  /** At most this many files in total (already attached + new). */
  maxFiles?: number;
  /** Marks the first file as the main one. */
  markFirstAsMain?: boolean;
  label?: string;
};

export type FileUploadProps = SingleProps | MultiProps;

export type { MultiProps, SingleProps };

export type CropSession = {
  objectUrl: string;
  filename: string;
  mimeType: ImageMimeType;
  /** Files still waiting for crop after the current one. */
  pending: Array<{
    objectUrl: string;
    filename: string;
    mimeType: ImageMimeType;
  }>;
};
