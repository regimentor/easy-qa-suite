import { ProjectForm } from "@/units/project/project-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center mt-10">
      <ProjectForm />
    </div>
  );
}
