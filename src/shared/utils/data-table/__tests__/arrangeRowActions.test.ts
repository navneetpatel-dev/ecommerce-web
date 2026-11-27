import { Eye } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import type {
  RowActionEntry,
  RowActionKind,
} from "../../../types/data-table/rowActions.types";
import { arrangeRowActions } from "../arrangeRowActions";

function entry(label: string, kind: RowActionKind = "default"): RowActionEntry {
  return {
    id: label,
    label,
    kind,
    icon: Eye,
    disabled: false,
    loading: false,
    marker: document.createElement("span"),
    run: vi.fn(),
  };
}

const labels = (entries: RowActionEntry[]) => entries.map((item) => item.label);

describe("arrangeRowActions", () => {
  it("puts View then Edit in the tiles, whatever order they arrive in", () => {
    const { tiles, list } = arrangeRowActions([
      entry("Edit", "edit"),
      entry("Attributes"),
      entry("View", "view"),
    ]);

    expect(labels(tiles)).toEqual(["View", "Edit"]);
    expect(labels(list)).toEqual(["Attributes"]);
  });

  it("keeps a single tile when only one of the two exists", () => {
    const { tiles } = arrangeRowActions([
      entry("Edit", "edit"),
      entry("Delete", "danger"),
    ]);

    expect(labels(tiles)).toEqual(["Edit"]);
  });

  it("has no tiles without View or Edit", () => {
    const { tiles, list } = arrangeRowActions([entry("Approve")]);

    expect(tiles).toEqual([]);
    expect(labels(list)).toEqual(["Approve"]);
  });

  it("moves a second view action to the list and destructive ones last", () => {
    const { tiles, list } = arrangeRowActions([
      entry("View", "view"),
      entry("Delete", "danger"),
      entry("Preview", "view"),
      entry("Archive"),
    ]);

    expect(labels(tiles)).toEqual(["View"]);
    expect(labels(list)).toEqual(["Preview", "Archive", "Delete"]);
  });
});
