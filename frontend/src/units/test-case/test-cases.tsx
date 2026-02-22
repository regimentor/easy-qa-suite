import { useQuery } from "@apollo/client";
import { testCasesQuery } from "./test-case.queries";
import type React from "react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  projectKey: string;
};

const getPriorityOptions = (t: (key: string) => string) =>
  TEST_CASE_PRIORITIES.map((p) => ({
    label: p === "All" ? t("common.all") : p,
    value: p,
  }));
const getStatusOptions = (t: (key: string) => string) =>
  TEST_CASE_STATUSES.map((s) => ({
    label: s === "All" ? t("common.all") : s,
    value: s,
  }));

export const TestCases: React.FC<TTestCasesProps> = ({
  projectId,
  projectKey,
}) => {
  const { data, loading, error } = useQuery(testCasesQuery, {
    variables: { projectId },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const priorityOptions = getPriorityOptions(t);
  const statusOptions = getStatusOptions(t);

  const filteredTestCases = useMemo(() => {
    if (!data?.testCases) return [];
    return data.testCases.filter((testCase) => {
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
  }, [data?.testCases, searchQuery, selectedPriority, selectedStatus]);

  const handleCreateTestCase = () => {
    navigate({
      to: "/projects/$project-key/test-cases/create",
      params: { "project-key": projectKey },
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>{t("testCase.listTitle")}</h1>
          <p className={styles.headerSub}>{t("testCase.listSubtitle")}</p>
        </div>
        <Button type="primary" onClick={handleCreateTestCase}>
          <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
          {t("testCase.newTestCase")}
        </Button>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder={t("testCase.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className={styles.filterGrid}>
          <div className={styles.filterBlock}>
            <label>{t("testCase.priorityFilter")}</label>
            <Segmented
              value={selectedPriority}
              onChange={(value) => value && setSelectedPriority(value as string)}
              options={priorityOptions}
              block
            />
          </div>
          <div className={styles.filterBlock}>
            <label>{t("testCase.statusFilter")}</label>
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
            <p className={styles.errorText}>{t("common.error")}: {error.message}</p>
          </div>
        )}

        {data && data.testCases.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>{t("testCase.noCases")}</h3>
            <p className={styles.emptySub}>
              {t("testCase.noCasesHint")}
            </p>
            <div className={styles.emptyBtnWrap}>
              <Button type="primary" onClick={handleCreateTestCase}>
                <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
                {t("testCase.newTestCase")}
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
                {t("testCase.noMatching")}
              </h3>
              <p className={styles.emptySub}>
                {t("testCase.noMatchingHint")}
              </p>
            </div>
          )}

        {data &&
          data.testCases.length > 0 &&
          filteredTestCases.length > 0 && (
            <div className={styles.list}>
              {filteredTestCases.map((testCase) => (
                <div key={testCase.id} className={styles.listItem}>
                  <TestCaseCard testCase={testCase} projectKey={projectKey} />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
