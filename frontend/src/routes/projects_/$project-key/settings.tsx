import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { projectByKeyQuery } from "@/units/project/projects.queries";
import { ProjectSettings } from "@/units/project/project-settings";

export const Route = createFileRoute("/projects_/$project-key/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey } = useParams({
    from: "/projects_/$project-key/settings",
  });
  const { data, loading } = useQuery(projectByKeyQuery, {
    variables: { key: projectKey },
    skip: !projectKey,
  });

  if (loading || !data?.projectByKey) {
    return <div>Loading...</div>;
  }

  const project = data.projectByKey;
  return <ProjectSettings projectId={project.id} />;
}
