import { useQuery } from "@apollo/client";
import type { ProjectModel } from "types/graphql";
import { projectQuery } from "./projects.queries";
import type React from "react";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { DateTime } from "luxon";

type TProjectDetails = {
  id: string;
};

export const ProjectDetails: React.FC<TProjectDetails> = ({ id }) => {
  const { data, loading, error } = useQuery<{ project: ProjectModel }>(
    projectQuery, 
    { 
      variables: { id } 
    }
  );

  // Format dates using Luxon with abbreviated month
  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat("d MMM yyyy");
  };

  if (loading) return <div className="p-6">Loading project details...</div>;
  if (error) return <div className="p-6">Error loading project: {error.message}</div>;
  if (!data?.project) return <div className="p-6">Project not found</div>;

  const project = data.project;

  return (
    <div className="rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="rounded-lg p-4 mr-5">
            <span className="font-bold text-2xl">
              {project.key}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex mt-6 text-sm border-t pt-4">
          <div className="flex items-center mr-6">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>Updated: {formatDate(project.updatedAt)}</span>
          </div>
        </div>

        {/* Here you can add more sections like test suites, test cases, etc. */}
      </div>
    </div>
  );
};
