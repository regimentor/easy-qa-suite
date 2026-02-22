import { useNavigate } from "@tanstack/react-router";
import type { TestCaseFields } from "./test-case.queries";
import { CalendarIcon } from "@/components/icons/CalendarIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { formatDate } from "@/lib/format-date";
import React from "react";
import styles from "./test-case-card.module.css";

export type TTestCaseCardProps = {
  testCase: TestCaseFields;
  projectKey: string;
};

export const TestCaseCard: React.FC<TTestCaseCardProps> = ({
  testCase,
  projectKey,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({
      to: "/projects/$project-key",
      params: { "project-key": projectKey },
    });
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return styles.priorityCritical;
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return styles.statusActive;
      case "draft":
        return styles.statusDraft;
      case "deprecated":
        return styles.statusDeprecated;
      default:
        return "";
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <div className={styles.body}>
            <div className={styles.headerRow}>
              <h3 className={styles.name}>{testCase.title}</h3>
              <span
                className={
                  styles.badge +
                  " " +
                  getPriorityClass(testCase.priority?.value ?? "")
                }
              >
                {(testCase.priority?.value ?? "").toUpperCase()}
              </span>
              <span
                className={
                  styles.badge +
                  " " +
                  getStatusClass(testCase.status?.value ?? "")
                }
              >
                {(testCase.status?.value ?? "").toUpperCase()}
              </span>
            </div>
            {testCase.description && (
              <p className={styles.desc}>{testCase.description}</p>
            )}
          </div>
        </div>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <CalendarIcon />
            <span>Created: {formatDate(testCase.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <ClockIcon />
            <span>Updated: {formatDate(testCase.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
