import { useQuery } from "@apollo/client";
import type { ProjectModel } from "types/graphql";
import { projectsQuery } from "./projects.queries";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ErrorIcon } from "@/components/icons/ErrorIcon";
import { EmptyStateIcon } from "@/components/icons/EmptyStateIcon";
import { useNavigate } from "@tanstack/react-router";
import { formatDate } from "@/lib/format-date";

type TProjectSmallCardProps = {
  project: ProjectModel;
};
const ProjectSmallCard: React.FC<TProjectSmallCardProps> = ({ project }) => {
  const navigate = useNavigate();

  // Format dates using Luxon with abbreviated month

  const handleCardClick = () => {
    navigate({
      to: "/projects/$project-id",
      params: { "project-id": project.id },
    });
  };

  return (
    <div
      className="hover:bg transition-colors duration-200 shadow-sm w-full mb-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="px-5 py-4">
        <div className="flex items-center">
          <div className="rounded-lg p-3 mr-4">
            <span className="font-bold text-xl">
              {project.key}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-1 text-sm line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex mt-4 text-xs">
          <div className="flex items-center mr-4">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Created: {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Updated: {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

type TProjcetsListProps = {
  listType?: "small" | "large";
};
export const ProjectsList: React.FC<TProjcetsListProps> = () => {
  const { data, loading, error } = useQuery<{ projects: ProjectModel[] }>(
    projectsQuery
  );
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1">Manage your testing projects</p>
        </div>
        <Button
          type="button"
          onClick={() => navigate({ to: "/projects/create" })}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5" />
          </div>
          <Input
            type="text"
            className="pl-10 pr-3 py-2"
            placeholder="Search projects..."
          />
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

        {data && data.projects.length === 0 && (
          <div className="rounded-lg py-12 px-6 text-center mx-6 my-6">
            <EmptyStateIcon className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-medium">
              No projects found
            </h3>
            <p className="mt-1 text-sm">
              Get started by creating a new project.
            </p>
            <div className="mt-6">
              <Button
                className="font-medium inline-flex items-center"
                type="button"
                onClick={() => navigate({ to: "/projects/create" })}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        )}

        {/* Projects list */}
        {data && data.projects.length > 0 && (
          <div className="p-6 space-y-0 divide-y">
            {data.projects.map((project) => (
              <div key={project.id} className="py-2">
                <ProjectSmallCard key={project.id} project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
