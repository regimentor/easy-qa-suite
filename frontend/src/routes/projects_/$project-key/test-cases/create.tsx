import { createFileRoute, useParams } from "@tanstack/react-router";
import { CreateTestCase } from "@/units/test-case/create-test-case";
import { useQuery } from "@apollo/client";
import { projectByKeyQuery } from "@/units/project/projects.queries";

export const Route = createFileRoute(
  "/projects_/$project-key/test-cases/create"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey } = useParams({
    from: "/projects_/$project-key/test-cases/create",
  });
  const { data, loading } = useQuery(projectByKeyQuery, {
    variables: { key: projectKey },
    skip: !projectKey,
  });

  if (loading || !data?.projectByKey) {
    return <div>Loading...</div>;
  }

  const project = data.projectByKey;
  return <CreateTestCase projectId={project.id} projectKey={project.key} />;
}
