import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { projectByKeyQuery } from "@/units/project/projects.queries";
import { testCaseQuery } from "@/units/test-case/test-case.queries";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { formatDate } from "@/lib/format-date";
import styles from "./$case-id.module.css";

export const Route = createFileRoute(
  "/projects_/$project-key/test-cases/$case-id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey, "case-id": caseId } = Route.useParams();
  const { t } = useTranslation();

  const { data: projectData, loading: projectLoading } = useQuery(
    projectByKeyQuery,
    {
      variables: { key: projectKey },
      skip: !projectKey,
    }
  );

  const {
    data: caseData,
    loading: caseLoading,
    error: caseError,
  } = useQuery(testCaseQuery, {
    variables: { id: caseId },
    skip: !caseId,
  });

  const loading = projectLoading || caseLoading;
  const project = projectData?.projectByKey;
  const testCase = caseData?.testCase;

  if (loading || !project) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (caseError) {
    return (
      <div className={styles.wrap}>
        <div className={styles.errorWrap}>
          <ErrorIcon className={styles.errorIcon} />
          <p className={styles.errorText}>
            {t("common.error")}: {caseError.message}
          </p>
        </div>
      </div>
    );
  }

  if (!testCase) {
    return null;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.badge}>
            {(testCase.priority?.value ?? "").toUpperCase()}
          </span>
          <span className={styles.badge}>
            {(testCase.status?.value ?? "").toUpperCase()}
          </span>
        </div>
        <h1 className={styles.title}>{testCase.title}</h1>
        <p className={styles.meta}>
          {t("project.created")}: {formatDate(testCase.createdAt)}
          {" · "}
          {t("project.updated")}: {formatDate(testCase.updatedAt)}
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("testCase.description")}</h2>
        <p className={styles.body}>{testCase.description || "—"}</p>
      </section>

      {testCase.preconditions && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("testCase.preconditions")}</h2>
          <p className={styles.body}>{testCase.preconditions}</p>
        </section>
      )}

      {testCase.postconditions && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("testCase.postconditions")}</h2>
          <p className={styles.body}>{testCase.postconditions}</p>
        </section>
      )}
    </div>
  );
}
