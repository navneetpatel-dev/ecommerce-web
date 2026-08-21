// Uploads feature — public API
//
// Owns file uploads: the upload API client (re-exporting the shared upload
// endpoint bindings) and the React Query mutation hooks for single and bulk
// file uploads. The useUploadFile hook is consumed by other features
// (e.g. account) wherever images or documents are attached.
export { useUploadFile } from "./api/uploads.queries";
