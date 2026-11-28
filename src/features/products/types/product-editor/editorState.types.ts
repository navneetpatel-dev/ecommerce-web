export interface ProductEditorStateOptions {
  mode: "create" | "edit" | null;
  editId: string | null;
  close: () => void;
  /** Called after a successful save (refresh the list). */
  onSaved: () => void;
  /** Admin: the product is listed for a vendor chosen in the form. */
  requireVendor?: boolean;
}
