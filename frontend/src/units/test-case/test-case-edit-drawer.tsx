import type React from "react";
import { Button, Drawer } from "antd";
import type { TestCaseFields } from "./test-case.queries";

type TestCaseEditDrawerProps = {
  open: boolean;
  editingCase: TestCaseFields | null;
  onClose: () => void;
  onOpenPage: (caseId: string) => void;
  titleLabel: string;
  drawerTitle: string;
  priorityLabel: string;
  statusLabel: string;
  descriptionLabel: string;
  openCasePageButtonLabel: string;
  styles: Record<
    "drawerBody" | "drawerField" | "drawerLabel" | "drawerValue",
    string
  >;
};

export const TestCaseEditDrawer: React.FC<TestCaseEditDrawerProps> = ({
  open,
  editingCase,
  onClose,
  onOpenPage,
  drawerTitle,
  titleLabel,
  priorityLabel,
  statusLabel,
  descriptionLabel,
  openCasePageButtonLabel,
  styles,
}) => (
  <Drawer
    title={drawerTitle}
    open={open}
    onClose={onClose}
    width={400}
    footer={
      editingCase ? (
        <Button
          type="primary"
          block
          onClick={() => onOpenPage(editingCase.id)}
        >
          {openCasePageButtonLabel}
        </Button>
      ) : null
    }
  >
    {editingCase && (
      <div className={styles.drawerBody}>
        <div className={styles.drawerField}>
          <span className={styles.drawerLabel}>{titleLabel}</span>
          <span className={styles.drawerValue}>{editingCase.title}</span>
        </div>
        <div className={styles.drawerField}>
          <span className={styles.drawerLabel}>{priorityLabel}</span>
          <span className={styles.drawerValue}>
            {editingCase.priority?.value ?? "—"}
          </span>
        </div>
        <div className={styles.drawerField}>
          <span className={styles.drawerLabel}>{statusLabel}</span>
          <span className={styles.drawerValue}>
            {editingCase.status?.value ?? "—"}
          </span>
        </div>
        {editingCase.description ? (
          <div className={styles.drawerField}>
            <span className={styles.drawerLabel}>{descriptionLabel}</span>
            <span className={styles.drawerValue}>
              {editingCase.description}
            </span>
          </div>
        ) : null}
      </div>
    )}
  </Drawer>
);
