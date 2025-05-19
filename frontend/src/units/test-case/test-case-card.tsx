import type { TestCaseModel } from "types/graphql";
import { useNavigate } from "@tanstack/react-router";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { formatDate } from "@/lib/format-date";
import React from "react";

export type TTestCaseCardProps = {
  testCase: TestCaseModel;
};

export const TestCaseCard: React.FC<TTestCaseCardProps> = ({ testCase }) => {
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
