// types of user role
export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type ROLES = keyof typeof USER_ROLE;

// types of issue type
export const ISSUE_TYPE = {
  bug: "bug",
  feature_request: "feature_request",
};

export type ISSUE_TYPES = keyof typeof ISSUE_TYPE;

// types of issue status
export const ISSUE_STATUS = {
  open: "open",
  in_progress: "in_progress",
  resolved: "resolved",
};

export type ISSUE_STATUSES = keyof typeof ISSUE_STATUS;

export type IssueQuery = {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};
