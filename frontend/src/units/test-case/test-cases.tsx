import { useQuery } from "@apollo/client";
import type { TestCaseModel } from "types/graphql";
import { testCasesQuery } from "./test-case.queries";
import type React from "react";
import { useState, useMemo } from "react";
import { Button, Input, Segmented } from "antd";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { TEST_CASE_PRIORITIES, TEST_CASE_STATUSES } from "./consts";
import { TestCaseCard } from "./test-case-card";
import styles from "./test-cases.module.css";

type TTestCasesProps = {
  projectId: string;
};

const priorityOptions = TEST_CASE_PRIORITIES.map((p) => ({
  label: p,
  value: p,
}));
const statusOptions = TEST_CASE_STATUSES.map((s) => ({
  label: s,
  value: s,
}));

export const TestCases: React.FC<TTestCasesProps> = ({ projectId }) => {
  const { data, loading, error } = useQuery<{ testCases: TestCaseModel[] }>(
    testCasesQuery,
    { variables: { projectId } }
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTestCases = useMemo(() => {
    if (!data?.testCases) return [];
    return data.testCases.filter((testCase) => {
      const matchesSearch = testCase.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        selectedPriority.toLowerCase() === "all" ||
        testCase.priority.toLowerCase() === selectedPriority.toLowerCase();
      const matchesStatus =
        selectedStatus.toLowerCase() === "all" ||
        testCase.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [data?.testCases, searchQuery, selectedPriority, selectedStatus]);

  const handleCreateTestCase = () => {
    navigate({
      to: "/projects/$project-id/test-cases/create",
      params: { "project-id": projectId },
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Test Cases</h1>
          <p className={styles.headerSub}>Manage test cases for this project</p>
        </div>
        <Button type="primary" onClick={handleCreateTestCase}>
          <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
          New Test Case
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Search test cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className={styles.filterGrid}>
          <div className={styles.filterBlock}>
            <label>Priority Filter</label>
            <Segmented
              value={selectedPriority}
              onChange={(value) => value && setSelectedPriority(value as string)}
              options={priorityOptions}
              block
            />
          </div>
          <div className={styles.filterBlock}>
            <label>Status Filter</label>
            <Segmented
              value={selectedStatus}
              onChange={(value) => value && setSelectedStatus(value as string)}
              options={statusOptions}
              block
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
          </div>
        )}

        {error && (
          <div className={styles.errorWrap}>
            <ErrorIcon className={styles.errorIcon} />
            <p className={styles.errorText}>Error: {error.message}</p>
          </div>
        )}

        {data && data.testCases.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No test cases found</h3>
            <p className={styles.emptySub}>
              Get started by creating a new test case.
            </p>
            <div className={styles.emptyBtnWrap}>
              <Button type="primary" onClick={handleCreateTestCase}>
                <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
                New Test Case
              </Button>
            </div>
          </div>
        )}

        {data &&
          data.testCases.length > 0 &&
          filteredTestCases.length === 0 && (
            <div className={styles.emptyWrap}>
              <EmptyStateIcon className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>
                No matching test cases found
              </h3>
              <p className={styles.emptySub}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

        {data &&
          data.testCases.length > 0 &&
          filteredTestCases.length > 0 && (
            <div className={styles.list}>
              {filteredTestCases.map((testCase) => (
                <div key={testCase.id} className={styles.listItem}>
                  <TestCaseCard testCase={testCase} />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
