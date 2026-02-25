import { Link, useNavigate } from "@tanstack/react-router";
import type { TestSuiteFields } from "./test-suite.queries";
import type React from "react";
import { Popover, Tag } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "./test-suite-card.module.css";

export type TTestSuiteCardProps = {
  testSuite: TestSuiteFields;
  projectKey: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

export const TestSuiteCard: React.FC<TTestSuiteCardProps> = ({
  testSuite,
  projectKey,
  selectable,
  selected,
  onSelect,
}) => {
  const navigate = useNavigate();

  const suiteUrl = {
    to: "/projects/$project-key/test-suites/$suite-id" as const,
    params: { "project-key": projectKey, "suite-id": testSuite.id },
  };

  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect();
      return;
    }
    navigate(suiteUrl);
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const cardClassName = [styles.card, selected ? styles.cardSelected : null]
    .filter(Boolean)
    .join(" ");

  const titleBlock = (
    <div className={styles.body}>
      <div className={styles.nameRow}>
        <Link
          to={suiteUrl.to}
          params={suiteUrl.params}
          className={styles.nameLink}
          onClick={handleNameClick}
        >
          {testSuite.name}
        </Link>
        {testSuite.description && (
          <Popover content={testSuite.description} trigger="hover">
            <span className={styles.descTrigger} onClick={handleNameClick}>
              <InfoCircleOutlined />
            </span>
          </Popover>
        )}
      </div>
      {testSuite.type?.value && (
        <span className={styles.tagWrap}>
          <Tag>{(testSuite.type.value).toUpperCase()}</Tag>
        </span>
      )}
    </div>
  );

  return (
    <div className={cardClassName} onClick={handleCardClick}>
      <div className={styles.inner}>{titleBlock}</div>
    </div>
  );
};
