import type { ImageMimeType } from "@/shared/constants/imageSpecs";
import type {
  UploadEntityType,
  UploadPurpose,
} from "@/shared/constants/uploads/uploads";

export type PreviewEntry = { storedUrl: string; displayUrl: string };

type SingleProps = {
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

type MultiProps = {
  mode: "multiple";
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
  accept?: string;
  maxBytes?: number;
  disabled?: boolean;
  valueUrls?: string[];
  onUploaded: (urls: string[]) => void;
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
