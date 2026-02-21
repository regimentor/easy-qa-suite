import { createFileRoute } from "@tanstack/react-router";
import styles from "./index.module.css";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <div className={styles.wrap}>empty</div>;
}
