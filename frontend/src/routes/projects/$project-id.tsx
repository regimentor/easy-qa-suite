import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetails } from "@/units/project/project-details";
import { TestSuiteList } from "@/units/test-suite/test-suite-list";
import { TestCases } from "@/units/test-case/test-cases";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/projects/$project-id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-id": projectId } = Route.useParams();
  const [activeTab, setActiveTab] = useState<string>("test-suites");

  // Set active tab based on URL hash when component mounts
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash === "test-suites" || hash === "test-cases") {
        setActiveTab(hash);
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="py-6 flex flex-col items-left justify-start w-full">
      <ProjectDetails id={projectId} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mt-3 ml-6">
          <TabsTrigger value="test-suites">Test Suites</TabsTrigger>
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="test-suites">
          <TestSuiteList projectId={projectId} />
        </TabsContent>

        <TabsContent value="test-cases">
          <TestCases projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
