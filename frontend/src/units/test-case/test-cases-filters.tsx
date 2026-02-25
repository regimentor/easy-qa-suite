import type React from "react";
import { Input, Select } from "antd";

type SelectOption = { label: string; value: string };

type TestCasesFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  priorityOptions: SelectOption[];
  statusOptions: SelectOption[];
  searchPlaceholder: string;
  priorityFilterPlaceholder: string;
  statusFilterPlaceholder: string;
  styles: Record<
    "filters" | "searchInput" | "filterRow" | "filterSelect",
    string
  >;
};

export const TestCasesFilters: React.FC<TestCasesFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  priorityOptions,
  statusOptions,
  searchPlaceholder,
  priorityFilterPlaceholder,
  statusFilterPlaceholder,
  styles,
}) => (
  <div className={styles.filters}>
    <Input
      placeholder={searchPlaceholder}
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className={styles.searchInput}
    />
    <div className={styles.filterRow}>
      <Select
        value={selectedPriority}
        onChange={(value) => value && onPriorityChange(value)}
        options={priorityOptions}
        className={styles.filterSelect}
        placeholder={priorityFilterPlaceholder}
      />
      <Select
        value={selectedStatus}
        onChange={(value) => value && onStatusChange(value)}
        options={statusOptions}
        className={styles.filterSelect}
        placeholder={statusFilterPlaceholder}
      />
    </div>
  </div>
);
