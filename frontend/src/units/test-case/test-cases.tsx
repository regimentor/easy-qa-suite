// filepath: /Users/evgeny/Projects/EasyQASuite/frontend/src/units/test-case/test-cases.tsx
import { useQuery } from "@apollo/client";
import type { TestCaseModel } from "types/graphql";
import { testCasesQuery } from "./test-case.queries";
import type React from "react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "@/lib/format-date";
import { TEST_CASE_PRIORITIES, TEST_CASE_STATUSES } from "./consts";

type TTestCaseCardProps = {
  testCase: TestCaseModel;
};

const TestCaseCard: React.FC<TTestCaseCardProps> = ({ testCase }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to project detail since test case routes might not exist yet
    navigate({
      to: "/projects/$project-id",
      params: {
        "project-id": testCase.projectId,
      },
    });
  };

  // Get priority color class based on priority level
  const getPriorityColorClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status color class based on status
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-purple-100 text-purple-800";
      case "deprecated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="rounded-lg hover:bg transition-colors duration-200 shadow-sm w-full mb-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="px-5 py-4">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{testCase.title}</h3>
              <span
                className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColorClass(testCase.priority)}`}
              >
                {testCase.priority.toUpperCase()}
              </span>
              <span
                className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(testCase.status)}`}
              >
                {testCase.status.toUpperCase()}
              </span>
            </div>
            {testCase.description && (
              <p className="mt-1 text-sm line-clamp-2">
                {testCase.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex mt-4 text-xs">
          <div className="flex items-center mr-4">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Created: {formatDate(testCase.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Updated: {formatDate(testCase.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

type TTestCasesProps = {
  projectId: string;
};

export const TestCases: React.FC<TTestCasesProps> = ({ projectId }) => {
  const { data, loading, error } = useQuery<{ testCases: TestCaseModel[] }>(
    testCasesQuery,
    {
      variables: { projectId },
    }
  );
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter test cases based on search query, selected priority and status
  const filteredTestCases = useMemo(() => {
    if (!data?.testCases) return [];

    return data.testCases.filter((testCase) => {
      const matchesSearch = testCase.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        selectedPriority.toLowerCase() === "all" ||
        testCase.priority.toLowerCase() === selectedPriority.toLowerCase();
      const matchesStatus =
        selectedStatus.toLowerCase() === "all" ||
        testCase.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [data?.testCases, searchQuery, selectedPriority, selectedStatus]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePrioritySelect = (priority: string) => {
    setSelectedPriority(priority);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
  };

  const handleCreateTestCase = () => {
    // Navigate to project detail page since test case create route might not exist yet
    navigate({
      to: "/projects/$project-id/test-cases/create",
      params: { "project-id": projectId },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">Test Cases</h1>
          <p className="mt-1">Manage test cases for this project</p>
        </div>
        <Button type="button" onClick={handleCreateTestCase}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Test Case
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
            placeholder="Search test cases..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Priority Filter
            </label>
            <ToggleGroup
              type="single"
              value={selectedPriority}
              onValueChange={(value) => value && handlePrioritySelect(value)}
              variant="outline"
              className="w-full flex-wrap"
            >
              {TEST_CASE_PRIORITIES.map((priority) => (
                <ToggleGroupItem
                  key={priority}
                  value={priority}
                  className="text-xs flex-grow cursor-pointer"
                >
                  {priority}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Status Filter
            </label>
            <ToggleGroup
              type="single"
              value={selectedStatus}
              onValueChange={(value) => value && handleStatusSelect(value)}
              variant="outline"
              className="w-full flex-wrap"
            >
              {TEST_CASE_STATUSES.map((status) => (
                <ToggleGroupItem
                  key={status}
                  value={status}
                  className="text-xs flex-grow cursor-pointer"
                >
                  {status}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
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

        {data && data.testCases.length === 0 && (
          <div className="rounded-lg py-12 px-6 text-center mx-6 my-6">
            <EmptyStateIcon className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-medium">No test cases found</h3>
            <p className="mt-1 text-sm">
              Get started by creating a new test case.
            </p>
            <div className="mt-6">
              <Button
                className="font-medium inline-flex items-center"
                type="button"
                onClick={handleCreateTestCase}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Test Case
              </Button>
            </div>
          </div>
        )}

        {data &&
          data.testCases.length > 0 &&
          filteredTestCases.length === 0 && (
            <div className="rounded-lg py-12 px-6 text-center mx-6 my-6">
              <EmptyStateIcon className="mx-auto h-12 w-12" />
              <h3 className="mt-2 text-lg font-medium">
                No matching test cases found
              </h3>
              <p className="mt-1 text-sm">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

        {/* Test Cases list */}
        {data && data.testCases.length > 0 && filteredTestCases.length > 0 && (
          <div className="space-y-0 divide-y">
            {filteredTestCases.map((testCase) => (
              <div key={testCase.id} className="py-2">
                <TestCaseCard key={testCase.id} testCase={testCase} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
