"use client";

import { AdminDataPage } from "../shared/AdminDataPage.page";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { useAdminQnaModerationPage } from "../../hooks/qna/useAdminQnaModerationPage";
import { adminPagesStyles } from "../shared/adminPages.styles";

const ALL = "__ALL__";

/** New and edited questions and answers awaiting a moderator's decision. */
export function AdminQnaModerationPage() {
  const page = useAdminQnaModerationPage();
  const activeCount = [
    page.filters.search.trim(),
    page.filters.kind,
    page.filters.submission,
    page.filters.authorType,
  ].filter(Boolean).length;

  return (
    <div className={adminPagesStyles.stack5}>
      <CollapsibleTableFilters
        activeCount={activeCount}
        onClear={page.filters.onClear}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <FormFieldFrame label={LABELS.search} htmlFor="qna-filter-search">
            <Input
              id="qna-filter-search"
              value={page.filters.search}
              onChange={(e) => page.filters.onSearchChange(e.target.value)}
              placeholder="Search by question, answer, product..."
            />
          </FormFieldFrame>

          <FormFieldFrame label="Type" htmlFor="qna-filter-kind">
            <Select
              value={page.filters.kind || ALL}
              onValueChange={(v) =>
                page.filters.onKindChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="qna-filter-kind">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Types</SelectItem>
                <SelectItem value="QUESTION">Questions</SelectItem>
                <SelectItem value="ANSWER">Answers</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame label="Submission" htmlFor="qna-filter-submission">
            <Select
              value={page.filters.submission || ALL}
              onValueChange={(v) =>
                page.filters.onSubmissionChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="qna-filter-submission">
                <SelectValue placeholder="All Submissions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Submissions</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="EDIT">Edited</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame label="Author" htmlFor="qna-filter-author">
            <Select
              value={page.filters.authorType || ALL}
              onValueChange={(v) =>
                page.filters.onAuthorTypeChange(v === ALL ? "" : v)
              }
            >
              <SelectTrigger id="qna-filter-author">
                <SelectValue placeholder="All Authors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Authors</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="VENDOR">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>
      </CollapsibleTableFilters>

      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        fetchRowDetail={page.fetchDetail}
        columnKeys={page.columnKeys}
      />
    </div>
  );
}
