import { ProjectsList } from "@/units/project/projects-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <ProjectsList />
    </div>
  );
}
