import type React from "react";
import { Button } from "antd";
import { PlusIcon } from "@/components/icons/PlusIcon";

type TestCasesHeaderProps = {
  title: string;
  createButtonTitle: string;
  onCreateClick: () => void;
  styles: Record<"header" | "headerTitle" | "iconSize", string>;
};

export const TestCasesHeader: React.FC<TestCasesHeaderProps> = ({
  title,
  createButtonTitle,
  onCreateClick,
  styles,
}) => (
  <div className={styles.header}>
    <h1 className={styles.headerTitle}>{title}</h1>
    <Button
      type="primary"
      icon={<PlusIcon className={styles.iconSize} />}
      title={createButtonTitle}
      onClick={onCreateClick}
    />
  </div>
);
