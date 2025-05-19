import { createFileRoute, useParams } from "@tanstack/react-router";
import { CreateTestCase } from "@/units/test-case/create-test-case";

export const Route = createFileRoute(
  "/projects_/$project-id/test-cases/create"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-id": projectId } = useParams({
    from: "/projects_/$project-id/test-cases/create",
  });
  return <CreateTestCase projectId={projectId} />;
}
