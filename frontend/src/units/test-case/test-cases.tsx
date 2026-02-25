import { useQuery } from "@apollo/client";
import { testCasesQuery } from "./test-case.queries";
import type { TestCaseFields } from "./test-case.queries";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { useTestCasesFilters } from "./use-test-cases-filters";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { getTestCasesColumns } from "./test-cases-columns";
import { TestCasesHeader } from "./test-cases-header";
import { TestCasesFilters } from "./test-cases-filters";
import { TestCasesTableBlock } from "./test-cases-table-block";
import { TestCaseEditDrawer } from "./test-case-edit-drawer";
import { INITIAL_VISIBLE } from "./consts";
import styles from "./test-cases.module.css";

/** Cast for passing CSS module to subcomponents that expect specific class keys */
const s = styles as Record<string, string>;

type TTestCasesProps = {
  projectId: string;
  projectKey: string;
  testSuiteId?: string | null;
};

export const TestCases: React.FC<TTestCasesProps> = ({
  projectId,
  projectKey,
  testSuiteId,
}) => {
  const { data, loading, error } = useQuery(testCasesQuery, {
    variables: { projectId, testSuiteId: testSuiteId ?? undefined },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [editingCase, setEditingCase] = useState<TestCaseFields | null>(null);

  const filters = useTestCasesFilters(data?.testCases);
  const {
    filteredTestCases,
    priorityOptions: getPriorityOptions,
    statusOptions: getStatusOptions,
  } = filters;
  const priorityOptions = getPriorityOptions(t);
  const statusOptions = getStatusOptions(t);

  const scroll = useInfiniteScroll(filteredTestCases);
  const { setVisibleCount } = scroll;

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [
    filteredTestCases.length,
    testSuiteId,
    filters.searchQuery,
    filters.selectedPriority,
    filters.selectedStatus,
    setVisibleCount,
  ]);

  const handleCreateTestCase = () => {
    navigate({
      to: "/projects/$project-key/test-cases/create",
      params: { "project-key": projectKey },
    });
  };

  const handleOpenCasePage = (caseId: string) => {
    setEditingCase(null);
    navigate({
      to: "/projects/$project-key/test-cases/$case-id",
      params: { "project-key": projectKey, "case-id": caseId },
    });
  };

  const columns = useMemo(
    () => getTestCasesColumns(t, projectKey, setEditingCase, s),
    [t, projectKey]
  );

  return (
    <div className={styles.wrap}>
      <TestCasesHeader
        title={t("testCase.listTitle")}
        createButtonTitle={t("testCase.newTestCase")}
        onCreateClick={handleCreateTestCase}
        styles={s}
      />

      <TestCasesFilters
        searchQuery={filters.searchQuery}
        onSearchChange={filters.setSearchQuery}
        selectedPriority={filters.selectedPriority}
        onPriorityChange={filters.setSelectedPriority}
        selectedStatus={filters.selectedStatus}
        onStatusChange={filters.setSelectedStatus}
        priorityOptions={priorityOptions}
        statusOptions={statusOptions}
        searchPlaceholder={t("testCase.searchPlaceholder")}
        priorityFilterPlaceholder={t("testCase.priorityFilter")}
        statusFilterPlaceholder={t("testCase.statusFilter")}
        styles={s}
      />

      <div className={styles.content}>
        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
          </div>
        )}

        {error && (
          <div className={styles.errorWrap}>
            <ErrorIcon className={styles.errorIcon} />
            <p className={styles.errorText}>
              {t("common.error")}: {error.message}
            </p>
          </div>
        )}

        {data && data.testCases.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>{t("testCase.noCases")}</h3>
            <p className={styles.emptySub}>{t("testCase.noCasesHint")}</p>
            <div className={styles.emptyBtnWrap}>
              <Button type="primary" onClick={handleCreateTestCase}>
                <PlusIcon
                  className={styles.iconMr + " " + styles.iconSize}
                />
                {t("testCase.newTestCase")}
              </Button>
            </div>
          </div>
        )}

        {data &&
          data.testCases.length > 0 &&
          filters.filteredTestCases.length === 0 && (
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
          filters.filteredTestCases.length > 0 && (
          <TestCasesTableBlock
            scrollRef={scroll.scrollRef}
            onScroll={scroll.handleScroll}
            columns={columns}
            visibleTestCases={scroll.visibleItems}
            hasMore={scroll.hasMore}
            loading={loading}
            loadMoreHintText={t("testCase.loadMoreHint", {
              count: scroll.visibleItems.length,
              total: filteredTestCases.length,
            })}
            styles={s}
          />
        )}
      </div>

      <TestCaseEditDrawer
        open={editingCase !== null}
        editingCase={editingCase}
        onClose={() => setEditingCase(null)}
        onOpenPage={handleOpenCasePage}
        drawerTitle={t("testCase.editDrawerTitle")}
        titleLabel={t("testCase.title")}
        priorityLabel={t("testCase.priority")}
        statusLabel={t("testCase.status")}
        descriptionLabel={t("testCase.description")}
        openCasePageButtonLabel={t("testCase.openCasePage")}
        styles={s}
      />
    </div>
  );
};
