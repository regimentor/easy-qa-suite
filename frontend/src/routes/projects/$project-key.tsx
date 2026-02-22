import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { projectByKeyQuery } from "@/units/project/projects.queries";
import { ProjectDetails } from "@/units/project/project-details";
import { TestSuiteList } from "@/units/test-suite/test-suite-list";
import { TestCases } from "@/units/test-case/test-cases";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import styles from "./project-id.module.css";

export const Route = createFileRoute("/projects/$project-key")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey } = Route.useParams();
  const [activeTab, setActiveTab] = useState<string>("test-suites");

  const { data, loading, error } = useQuery(projectByKeyQuery, {
    variables: { key: projectKey },
    skip: !projectKey,
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "test-suites" || hash === "test-cases") {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.location.hash = key;
  };

  if (loading || !data?.projectByKey) {
    return (
      <div className={styles.wrap}>
        <div style={{ padding: "1.5rem 0" }}>
          {loading ? "Loading project..." : error ? `Error: ${error.message}` : "Project not found"}
        </div>
      </div>
    );
  }

  const project = data.projectByKey;
  const projectId = project.id;

  const tabItems = [
    {
      key: "test-suites",
      label: "Test Suites",
      children: (
        <TestSuiteList projectId={projectId} projectKey={project.key} />
      ),
    },
    {
      key: "test-cases",
      label: "Test Cases",
      children: (
        <TestCases projectId={projectId} projectKey={project.key} />
      ),
    },
  ];

  return (
    <div className={styles.wrap}>
      <ProjectDetails id={projectId} />

      <Tabs
        className={styles.tabsWrap}
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
      />
    </div>
  );
}
