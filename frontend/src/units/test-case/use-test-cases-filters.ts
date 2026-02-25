import { useState, useMemo } from "react";
import type { TestCaseFields } from "./test-case.queries";
import { getPriorityOptions, getStatusOptions } from "./consts";

type TTranslate = (key: string) => string;

export function useTestCasesFilters(testCases: TestCaseFields[] | undefined) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTestCases = useMemo(() => {
    if (!testCases) return [];
    return testCases.filter((testCase) => {
      const matchesSearch = testCase.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        selectedPriority.toLowerCase() === "all" ||
        (testCase.priority?.value?.toLowerCase() ?? "") ===
          selectedPriority.toLowerCase();
      const matchesStatus =
        selectedStatus.toLowerCase() === "all" ||
        (testCase.status?.value?.toLowerCase() ?? "") ===
          selectedStatus.toLowerCase();
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [testCases, searchQuery, selectedPriority, selectedStatus]);

  return {
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    filteredTestCases,
    priorityOptions: (t: TTranslate) => getPriorityOptions(t),
    statusOptions: (t: TTranslate) => getStatusOptions(t),
  };
}
