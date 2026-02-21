import { ProjectForm } from "@/units/project/project-form";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./create.module.css";

export const Route = createFileRoute("/projects/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className={styles.wrap}>
      <ProjectForm />
    </div>
  );
}
