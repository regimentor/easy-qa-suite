import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { projectByKeyQuery } from "@/units/project/projects.queries";
import {
  testSuiteQuery,
  type TestSuiteDetailFields,
} from "@/units/test-suite/test-suite.queries";
import { AddTestCasesToSuiteDrawer } from "@/units/test-suite/add-test-cases-to-suite-drawer";
import { TestCaseCard } from "@/units/test-case/test-case-card";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { formatDate } from "@/lib/format-date";
import styles from "./$suite-id.module.css";

export const Route = createFileRoute(
  "/projects_/$project-key/test-suites/$suite-id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey, "suite-id": suiteId } = Route.useParams();
  const { t } = useTranslation();
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const { data: projectData, loading: projectLoading } = useQuery(
    projectByKeyQuery,
    {
      variables: { key: projectKey },
      skip: !projectKey,
    }
  );

  const {
    data: suiteData,
    loading: suiteLoading,
    error: suiteError,
    refetch: refetchSuite,
  } = useQuery(testSuiteQuery, {
    variables: { id: suiteId },
    skip: !suiteId,
  });

  const project = projectData?.projectByKey;
  const suite = suiteData?.testSuite as TestSuiteDetailFields | undefined;
  const loading = projectLoading || suiteLoading;

  const handleAdded = () => {
    setAddDrawerOpen(false);
    refetchSuite();
  };

  if (loading || !project) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (suiteError) {
    return (
      <div className={styles.wrap}>
        <div className={styles.errorWrap}>
          <ErrorIcon className={styles.errorIcon} />
          <p className={styles.errorText}>
            {t("common.error")}: {suiteError.message}
          </p>
        </div>
      </div>
    );
  }

  if (!suite) {
    return null;
  }

  const testCases = suite.testCases ?? [];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 className={styles.headerTitle}>{suite.name}</h1>
            <span className={styles.badge}>
              {(suite.type?.value ?? "").toUpperCase()}
            </span>
          </div>
          {suite.description && (
            <p className={styles.headerSub}>{suite.description}</p>
          )}
          <p className={styles.suiteMeta}>
            {t("project.created")}: {formatDate(suite.createdAt)}
            {" · "}
            {t("project.updated")}: {formatDate(suite.updatedAt)}
          </p>
        </div>
        <Button
          type="primary"
          onClick={() => setAddDrawerOpen(true)}
        >
          <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
          {t("testSuite.addTestCases")}
        </Button>
      </div>

      <h2 className={styles.sectionTitle}>
        {t("testSuite.testCasesInSuite")}
      </h2>

      <div className={styles.content}>
        {testCases.length === 0 && (
          <div className={styles.emptyWrap}>
            <EmptyStateIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              {t("testSuite.noTestCasesInSuite")}
            </h3>
            <p className={styles.emptySub}>
              {t("testSuite.noTestCasesInSuiteHint")}
            </p>
            <div className={styles.emptyBtnWrap}>
              <Button
                type="primary"
                onClick={() => setAddDrawerOpen(true)}
              >
                <PlusIcon className={styles.iconMr + " " + styles.iconSize} />
                {t("testSuite.addTestCases")}
              </Button>
            </div>
          </div>
        )}

        {testCases.length > 0 && (
          <div className={styles.list}>
            {testCases.map((testCase) => (
              <div key={testCase.id} className={styles.listItem}>
                <TestCaseCard testCase={testCase} projectKey={projectKey} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTestCasesToSuiteDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        suiteId={suiteId}
        projectId={project.id}
        existingTestCaseIds={testCases.map((tc) => tc.id)}
        onAdded={handleAdded}
      />
    </div>
  );
}
