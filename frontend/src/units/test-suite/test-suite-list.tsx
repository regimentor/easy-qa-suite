import { useQuery } from "@apollo/client";
import { testSuitesQuery } from "./test-suite.queries";
import type React from "react";
import { useState, useMemo } from "react";
import { Button, Input, Segmented } from "antd";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { TEST_SUITE_TYPES } from "./const";
import { TestSuiteCard } from "./test-suite-card";
import styles from "./test-suite-list.module.css";

type TTestSuiteListProps = {
  projectId: string;
  projectKey: string;
};

const typeOptions = TEST_SUITE_TYPES.map((type) => ({
  label: type,
  value: type,
}));

export const TestSuiteList: React.FC<TTestSuiteListProps> = ({
  projectId,
  projectKey,
}) => {
  const { data, loading, error } = useQuery(testSuitesQuery, {
    variables: { projectId },
  });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredTestSuites = useMemo(() => {
    if (!data?.testSuites) return [];
    return data.testSuites.filter((testSuite) => {
      const matchesSearch = testSuite.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType.toLowerCase() === "all" ||
        (testSuite.type?.value?.toLowerCase() ?? "") ===
          selectedType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [data?.testSuites, searchQuery, selectedType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Test Suites</h1>
          <p className={styles.headerSub}>Manage test suites for this project</p>
        </div>
        <Button
          type="primary"
          onClick={() =>
            navigate({
              to: "/projects/$project-key/test-suites/create",
              params: { "project-key": projectKey },
            })
          }
        >
          <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
          New Test Suite
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="Search test suites..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          prefix={<SearchIcon className={styles.searchIcon} />}
        />

        <Segmented
          value={selectedType}
          onChange={(value) => value && setSelectedType(value as string)}
          options={typeOptions}
          block
        />
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

        {data && data.testSuites.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No test suites found</h3>
            <p className={styles.emptySub}>
              Get started by creating a new test suite.
            </p>
            <div className={styles.emptyBtnWrap}>
              <Button
                type="primary"
                onClick={() =>
                  navigate({
                    to: "/projects/$project-key/test-suites/create",
                    params: { "project-key": projectKey },
                  })
                }
              >
                <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
                New Test Suite
              </Button>
            </div>
          </div>
        )}

        {data &&
          data.testSuites.length > 0 &&
          filteredTestSuites.length === 0 && (
            <div className={styles.emptyWrap}>
              <EmptyStateIcon className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No matching test suites found</h3>
              <p className={styles.emptySub}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

        {data &&
          data.testSuites.length > 0 &&
          filteredTestSuites.length > 0 && (
            <div className={styles.list}>
              {filteredTestSuites.map((testSuite) => (
                <div key={testSuite.id} className={styles.listItem}>
                  <TestSuiteCard testSuite={testSuite} projectKey={projectKey} />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
