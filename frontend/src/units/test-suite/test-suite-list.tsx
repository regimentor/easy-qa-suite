// filepath: /Users/evgeny/Projects/EasyQASuite/frontend/src/units/test-suite/test-suite-list.ts
import { useQuery } from "@apollo/client";
import type { TestSuiteModel } from "types/graphql";
import { testSuitesQuery } from "./test-suite.queries";
import type React from "react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { TEST_SUITE_TYPES } from "./const";
import { TestSuiteCard } from "./test-suite-card";

// Test suite types based on seed data

type TTestSuiteListProps = {
  projectId: string;
};

export const TestSuiteList: React.FC<TTestSuiteListProps> = ({ projectId }) => {
  const { data, loading, error } = useQuery<{ testSuites: TestSuiteModel[] }>(
    testSuitesQuery,
    {
      variables: { projectId },
    }
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Filter test suites based on search query and selected type
  const filteredTestSuites = useMemo(() => {
    if (!data?.testSuites) return [];

    return data.testSuites.filter((testSuite) => {
      const matchesSearch = testSuite.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType.toLowerCase() === "all" ||
        testSuite.type.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [data?.testSuites, searchQuery, selectedType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">Test Suites</h1>
          <p className="mt-1">Manage test suites for this project</p>
        </div>
        <Button
          type="button"
          onClick={() =>
            navigate({
              to: "/projects/$project-id/test-suites/create",
              params: { "project-id": projectId },
            })
          }
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Test Suite
        </Button>
      </div>

      {/* Search bar and filters */}
      <div className="px-6 py-4 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5" />
          </div>
          <Input
            type="text"
            className="pl-10 pr-3 py-2"
            placeholder="Search test suites..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <ToggleGroup
          type="single"
          value={selectedType}
          onValueChange={(value) => value && handleTypeSelect(value)}
          variant="outline"
          className="w-full flex-wrap"
        >
          {TEST_SUITE_TYPES.map((type) => (
            <ToggleGroupItem
              key={type}
              value={type}
              className="text-xs flex-grow cursor-pointer"
            >
              {type}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Main content area with scrolling */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading, error and empty states */}
        {loading && (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"></div>
          </div>
        )}

        {error && (
          <div className="border-l-4 p-4 m-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ErrorIcon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">Error: {error.message}</p>
              </div>
            </div>
          </div>
        )}

        {data && data.testSuites.length === 0 && (
          <div className="rounded-lg py-12 px-6 text-center mx-6 my-6">
            <EmptyStateIcon className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-medium">No test suites found</h3>
            <p className="mt-1 text-sm">
              Get started by creating a new test suite.
            </p>
            <div className="mt-6">
              <Button
                className="font-medium inline-flex items-center"
                type="button"
                onClick={() =>
                  navigate({
                    to: "/projects/$project-id/test-suites/create",
                    params: { "project-id": projectId },
                  })
                }
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Test Suite
              </Button>
            </div>
          </div>
        )}

        {data &&
          data.testSuites.length > 0 &&
          filteredTestSuites.length === 0 && (
            <div className="rounded-lg py-12 px-6 text-center mx-6 my-6">
              <EmptyStateIcon className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-lg font-medium">
                No matching test suites found
              </h3>
              <p className="mt-1 text-sm">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

        {/* Test Suites list */}
        {data &&
          data.testSuites.length > 0 &&
          filteredTestSuites.length > 0 && (
            <div className="space-y-0 divide-y">
              {filteredTestSuites.map((testSuite) => (
                <div key={testSuite.id} className="py-2">
                  <TestSuiteCard key={testSuite.id} testSuite={testSuite} />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};
