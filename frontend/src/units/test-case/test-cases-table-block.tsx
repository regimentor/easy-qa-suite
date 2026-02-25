import type React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TestCaseFields } from "./test-case.queries";

type TestCasesTableBlockProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  columns: ColumnsType<TestCaseFields>;
  visibleTestCases: TestCaseFields[];
  hasMore: boolean;
  loading: boolean;
  loadMoreHintText: string;
  styles: Record<
    "tableScrollWrap" | "tableWrap" | "table" | "loadMoreHint",
    string
  >;
};

export const TestCasesTableBlock: React.FC<TestCasesTableBlockProps> = ({
  scrollRef,
  onScroll,
  columns,
  visibleTestCases,
  hasMore,
  loading,
  loadMoreHintText,
  styles,
}) => (
  <div
    ref={scrollRef}
    className={styles.tableScrollWrap}
    onScroll={onScroll}
  >
    <div className={styles.tableWrap}>
      <Table
        columns={columns}
        dataSource={visibleTestCases}
        rowKey="id"
        loading={loading}
        pagination={false}
        className={styles.table}
        sticky={true}
      />
    </div>
    {hasMore && (
      <div className={styles.loadMoreHint}>{loadMoreHintText}</div>
    )}
  </div>
);
