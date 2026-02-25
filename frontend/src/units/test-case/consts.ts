// Test case priorities based on common QA practices
export const TEST_CASE_PRIORITIES = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low"
];

// Test case statuses
export const TEST_CASE_STATUSES = [
  "All",
  "Active",
  "Draft",
  "Deprecated"
];

// Infinite scroll / load more
export const INITIAL_VISIBLE = 40;
export const LOAD_MORE_SIZE = 40;
export const SCROLL_THRESHOLD = 120;

export const getPriorityOptions = (t: (key: string) => string) =>
  TEST_CASE_PRIORITIES.map((p) => ({
    label: p === "All" ? t("common.all") : p,
    value: p,
  }));

export const getStatusOptions = (t: (key: string) => string) =>
  TEST_CASE_STATUSES.map((s) => ({
    label: s === "All" ? t("common.all") : s,
    value: s,
  }));
