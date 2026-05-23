import type { ISSUE_STATUSES, ISSUE_TYPES } from "../../types";

export interface TIssue {
  title: string;
  description: string;
  type: ISSUE_TYPES;
}
