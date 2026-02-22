import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/projects_/$project-key/test-suites/$suite-id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/projects_/$project-key/test-suites/$suite-id"!</div>;
}
