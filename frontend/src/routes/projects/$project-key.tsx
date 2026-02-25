import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { projectByKeyQuery } from "@/units/project/projects.queries";
import { ProjectDetails } from "@/units/project/project-details";
import { TestSuiteList } from "@/units/test-suite/test-suite-list";
import { TestCases } from "@/units/test-case/test-cases";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./project-id.module.css";

export const Route = createFileRoute("/projects/$project-key")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey } = Route.useParams();
  const { t } = useTranslation();
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(projectByKeyQuery, {
    variables: { key: projectKey },
    skip: !projectKey,
  });

  if (loading || !data?.projectByKey) {
    return (
      <div className={styles.wrap}>
        <div style={{ padding: "1.5rem 0" }}>
          {loading ? t("project.loading") : error ? `${t("common.error")}: ${error.message}` : t("project.notFound")}
        </div>
      </div>
    );
  }

  const project = data.projectByKey;
  const projectId = project.id;

  const handleSuiteSelect = (suiteId: string | null) => {
    setSelectedSuiteId(suiteId);
  };

  return (
    <div className={styles.wrap}>
      <ProjectDetails id={projectId} projectKey={project.key} />

      <div className={styles.columnsPanel}>
        <div className={styles.twoColumns}>
          <div className={styles.leftColumn}>
            <TestSuiteList
              projectId={projectId}
              projectKey={project.key}
              selectedSuiteId={selectedSuiteId}
              onSuiteSelect={handleSuiteSelect}
            />
          </div>
          <div className={styles.rightColumn}>
            <TestCases
              projectId={projectId}
              projectKey={project.key}
              testSuiteId={selectedSuiteId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
