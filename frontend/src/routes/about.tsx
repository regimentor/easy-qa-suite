import { Button } from "antd";
import { createFileRoute } from "@tanstack/react-router";
import styles from "./about.module.css";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className={styles.wrap}>
      <Button>HIIE</Button>
    </div>
  );
}
