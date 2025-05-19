import type { TestSuiteModel } from "types/graphql";
import { useNavigate } from "@tanstack/react-router";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { formatDate } from "@/lib/format-date";
import type React from "react";

export type TTestSuiteCardProps = {
  testSuite: TestSuiteModel;
};

export const TestSuiteCard: React.FC<TTestSuiteCardProps> = ({ testSuite }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({
      to: "/projects/$project-id/test-suites/$suite-id",
      params: {
        "project-id": testSuite.projectId,
        "suite-id": testSuite.id,
      },
    });
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
              <h3 className="text-lg font-semibold">{testSuite.name}</h3>
              <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium">
                {testSuite.type.toUpperCase()}
              </span>
            </div>
            {testSuite.description && (
              <p className="mt-1 text-sm line-clamp-2">
                {testSuite.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex mt-4 text-xs">
          <div className="flex items-center mr-4">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Created: {formatDate(testSuite.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Updated: {formatDate(testSuite.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
