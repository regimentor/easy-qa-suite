import { CreateTestSuite } from "@/units/test-suite/create-test-suite";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/projects_/$project-id/test-suites/create"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { "project-id": projectId } = Route.useParams();
  return (
    <div>
      <CreateTestSuite projectId={projectId} />
    </div>
  );
}
