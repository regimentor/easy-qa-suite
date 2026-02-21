import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetails } from "@/units/project/project-details";
import { TestSuiteList } from "@/units/test-suite/test-suite-list";
import { TestCases } from "@/units/test-case/test-cases";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import styles from "./project-id.module.css";

export const Route = createFileRoute("/projects/$project-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-id": projectId } = Route.useParams();
  const [activeTab, setActiveTab] = useState<string>("test-suites");

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

  const tabItems = [
    {
      key: "test-suites",
      label: "Test Suites",
      children: <TestSuiteList projectId={projectId} />,
    },
    {
      key: "test-cases",
      label: "Test Cases",
      children: <TestCases projectId={projectId} />,
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
