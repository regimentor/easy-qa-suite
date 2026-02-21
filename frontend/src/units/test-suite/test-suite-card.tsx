import type { TestSuiteModel } from "types/graphql";
import { useNavigate } from "@tanstack/react-router";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { formatDate } from "@/lib/format-date";
import type React from "react";
import styles from "./test-suite-card.module.css";

export type TTestSuiteCardProps = {
  testSuite: TestSuiteModel;
};

export const TestSuiteCard: React.FC<TTestSuiteCardProps> = ({ testSuite }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({
      to: "/projects/$project-id/test-suites/$suite-id",
      params: {
        "project-id": testSuite.projectId,
        "suite-id": testSuite.id,
      },
    });
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <div className={styles.body}>
            <div className={styles.headerRow}>
              <h3 className={styles.name}>{testSuite.name}</h3>
              <span className={styles.badge}>{testSuite.type.toUpperCase()}</span>
            </div>
            {testSuite.description && (
              <p className={styles.desc}>{testSuite.description}</p>
            )}
          </div>
        </div>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <CalendarIcon />
            <span>Created: {formatDate(testSuite.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <ClockIcon />
            <span>Updated: {formatDate(testSuite.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
