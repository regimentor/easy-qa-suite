import { CreateTestSuite } from "@/units/test-suite/create-test-suite";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { projectByKeyQuery } from "@/units/project/projects.queries";

export const Route = createFileRoute(
  "/projects_/$project-key/test-suites/create"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-key": projectKey } = Route.useParams();
  const { data, loading } = useQuery(projectByKeyQuery, {
    variables: { key: projectKey },
    skip: !projectKey,
  });

  if (loading || !data?.projectByKey) {
    return <div>Loading...</div>;
  }

  const project = data.projectByKey;
  return (
    <div>
      <CreateTestSuite projectId={project.id} projectKey={project.key} />
    </div>
  );
}
